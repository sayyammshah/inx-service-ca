import {
  DATABASE_CONSTANTS,
  InsightErrorMessage,
  UpdateInsightActions,
} from '@bindings/common/constants.js'
import { ControllerResponse, RequestContext } from '@bindings/common/types.js'
import { genStack } from '@bindings/common/utils.js'
import { InsightDataAdapter } from '@bindings/mongo-database'
import { CreateNewInsight, FetchInsightPost } from '@core/app'
import { generateInsightDto, InsightDto } from '@core/business'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'
import { UpdateInsightPost } from 'core/applications/insight.app.js'
import { AppError } from 'shared/apiResponseCls.js'
import { ResponseStatusCodes } from 'shared/constants.js'
import { logger } from 'shared/logger.js'

/**
 * Creates a new insight based on the provided body data.
 * This function is responsible for handling the creation of a new insight in the system.
 * It validates the input data, prepares the payload DTO, and calls the core module to create the insight.
 *
 * @param body - The request body containing the insight data.
 * @param requestContext - The context of the request, containing relevant information such as user details.
 *
 * @returns A {@link CoreAppResponse} object containing the status and data of the insight creation operation.
 */
export const CreateInsight = async (
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<CoreAppResponse> => {
  logger.info(`${requestId}: ${CreateInsight.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BAD_REQUEST,
      InsightErrorMessage.INVALID_PARAMS,
      `${genStack(import.meta.url)} = ${CreateInsight.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${CreateNewInsight.name}()`,
  )
  const payload: InsightDto = generateInsightDto(body)
  const result: CoreAppResponse = await CreateNewInsight(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    payload,
  )

  if (result.status !== ResponseStatusCodes.CREATED) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${InsightErrorMessage.FAILED_TO_CREATE_INSIGHT}${result.message}`,
      `${genStack(import.meta.url)} ${CreateInsight.name}`,
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
 * @returns A promise that resolves to a CoreAppResponse containing the fetched insights.
 * @throws {AppError} If the response status is not OK, an error is thrown with the appropriate message and status code.
 */
export const FetchInsights = async (
  { requestId }: RequestContext,
  queryParams?: Record<string, string>,
): Promise<CoreAppResponse> => {
  logger.info(`${requestId}: ${CreateInsight.name} controller called`)

  let response: ControllerResponse | null = null

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${FetchInsightPost.name}()`,
  )
  const result: CoreAppResponse = await FetchInsightPost(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    queryParams,
    { projection: DATABASE_CONSTANTS.PROJECTIONS.INSIGHTS },
  )

  if (result.status !== ResponseStatusCodes.OK) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${InsightErrorMessage.NO_RECORDS}${result.message}`,
      `${genStack(import.meta.url)} - ${FetchInsights.name}()`,
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
export const UpdateInsight = async (
  payload: {
    insightId: string
    document: Record<string, unknown>
    action?: UpdateInsightActions
  },
  { requestId }: RequestContext,
) => {
  logger.info(`${requestId}: ${UpdateInsight.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(payload).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BAD_REQUEST,
      InsightErrorMessage.INVALID_PARAMS,
      `${genStack(import.meta.url)} - ${UpdateInsight.name}()`,
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
    `${requestId}: Core module process initiated - ${UpdateInsight.name}()`,
  )
  const result: CoreAppResponse = await UpdateInsightPost(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    {
      filter: { insightId },
      document: documentToUpdate,
      options: { projection: DATABASE_CONSTANTS.PROJECTIONS.USER },
    },
  )

  if (result.status !== ResponseStatusCodes.OK) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${InsightErrorMessage.NO_RECORDS}${result.message}`,
      `${genStack(import.meta.url)} ${FetchInsights.name}`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: Insight fetched successfully`)

  response = {
    ...result,
  }
  return response
}
