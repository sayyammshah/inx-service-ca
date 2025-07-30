import {
  CreateInsight,
  FetchInsights,
  UpdateInsight,
  IInsightDto,
  CoreResultInstance,
} from '@core'

import { AppError, logger, ResponseStatusCodes } from '@shared'

import {
  DATABASE_CONSTANTS,
  InsightErrorMessage,
  UpdateInsightActions,
} from '../common/constants.js'
import { ControllerResponse, RequestContext } from '../common/types.js'
import { genStack } from '../common/utils.js'
import { InsightDataAdapter } from '../database/index.js'

/**
 * Creates a new insight based on the provided body data.
 * This function is responsible for handling the creation of a new insight in the system.
 * It validates the input data, prepares the payload DTO, and calls the core module to create the insight.
 *
 * @param body - The request body containing the insight data.
 * @param requestContext - The context of the request, containing relevant information such as user details.
 *
 * @returns A {@link ControllerResponse} object containing the status and data of the insight creation operation.
 */
export const CreateInsightController = async (
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<ControllerResponse> => {
  logger.info(`${requestId}: ${CreateInsightController.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BadRequest,
      InsightErrorMessage.INVALID_PARAMS,
      `${genStack(import.meta.url)} = ${CreateInsightController.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${CreateInsight.name}()`,
  )
  const result: CoreResultInstance = await CreateInsight(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    body as unknown as IInsightDto,
  )

  if (result.status !== ResponseStatusCodes.Created) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${InsightErrorMessage.FAILED_TO_CREATE_INSIGHT}${result.msg}`,
      `${genStack(import.meta.url)} ${CreateInsightController.name}`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: Insight created successfully`)

  response = {
    ...result,
  }
  return response
}

/**
 * Fetches insights based on the provided query parameters.
 *
 * @param requestContext - The context of the request, containing metadata and other relevant information.
 * @param queryParams - Optional query parameters to filter the insights.
 * @returns A promise that resolves to a ControllerResponse containing the fetched insights.
 * @throws {AppError} If the response status is not OK, an error is thrown with the appropriate message and status code.
 */
export const FetchInsightsController = async (
  { requestId }: RequestContext,
  queryParams?: Record<string, string>,
): Promise<ControllerResponse> => {
  logger.info(`${requestId}: ${FetchInsightsController.name} controller called`)

  let response: ControllerResponse | null = null

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${FetchInsights.name}()`,
  )
  const result: CoreResultInstance = await FetchInsights(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    queryParams,
    { projection: DATABASE_CONSTANTS.PROJECTIONS.INSIGHTS },
  )

  if (result.status !== ResponseStatusCodes.Ok) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${InsightErrorMessage.NO_RECORDS}${result.msg}`,
      `${genStack(import.meta.url)} - ${FetchInsightsController.name}()`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: Insight fetched successfully`)

  response = {
    ...result,
  }
  return response
}

/**
 * Updates an insight document based on the provided payload and request context.
 *
 * @param payload - The payload containing the insight ID, document to update, and optional action.
 * @param payload.insightId - The ID of the insight to update.
 * @param payload.document - The document containing the fields to update.
 * @param payload.action - Optional action to specify the type of update (e.g., StatsUpdate).
 * @param requestContext - The context of the request, used for logging and tracing.
 *
 * @returns A promise that resolves to the controller response containing the result of the update operation.
 *
 * @throws {AppError} If the payload is empty or if the update operation fails.
 */
export const UpdateInsightController = async (
  payload: {
    insightId: string
    document: Record<string, unknown>
    action?: UpdateInsightActions
  },
  { requestId }: RequestContext,
) => {
  logger.info(`${requestId}: ${UpdateInsightController.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(payload).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BadRequest,
      InsightErrorMessage.INVALID_PARAMS,
      `${genStack(import.meta.url)} - ${UpdateInsightController.name}()`,
    )
    throw appError
  }

  const { insightId, action, document } = payload

  let documentToUpdate = {}
  if (action === UpdateInsightActions.StatsUpdate)
    documentToUpdate = { $inc: { ...document } }
  else documentToUpdate = { $set: document }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${UpdateInsightController.name}()`,
  )
  const result: CoreResultInstance = await UpdateInsight(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    {
      filter: { insightId },
      document: documentToUpdate,
      options: { projection: DATABASE_CONSTANTS.PROJECTIONS.USER },
    },
  )

  if (result.status !== ResponseStatusCodes.Ok) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${InsightErrorMessage.NO_RECORDS}${result.msg}`,
      `${genStack(import.meta.url)} ${UpdateInsightController.name}`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: Insight fetched successfully`)

  response = {
    ...result,
  }
  return response
}
