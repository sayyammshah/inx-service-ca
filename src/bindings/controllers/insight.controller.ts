import { InsightErrorMessage } from '@bindings/common/constants.js'
import { ControllerResponse, RequestContext } from '@bindings/common/types.js'
import { InsightDataAdapter } from '@bindings/mongo-database'
import { CreateInsightPost, FetchInsightsPosts } from '@core/app'
import { generateInsightDto, InsightDto } from '@core/business'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'
import { fileURLToPath } from 'node:url'
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
  body: {
    [key: string]: string | number
  },
  requestContext: RequestContext,
): Promise<CoreAppResponse> => {
  logger.info(requestContext, `${CreateInsight.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = AppError.strigifyAppError(
      ResponseStatusCodes.BAD_REQUEST,
      InsightErrorMessage.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} ${CreateInsight.name}`,
    )
    throw appError
  }

  // Call core module
  logger.info(requestContext, `preparing payload DTO`)
  const payload: InsightDto = generateInsightDto(body)
  const result: CoreAppResponse = await CreateInsightPost(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    payload,
  )

  if (result.status !== ResponseStatusCodes.CREATED) {
    const errMsg = AppError.strigifyAppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${InsightErrorMessage.FAILED_TO_CREATE_INSIGHT}${result.message}`,
      `${fileURLToPath(import.meta.url)} ${CreateInsight.name}`,
    )
    throw errMsg
  }

  response = {
    ...result,
  }

  logger.info(requestContext, `Insight created successfully`)
  return response
}

export const FetchInsights = async (
  requestContext: RequestContext,
  queryParams?: Record<string, string>,
): Promise<CoreAppResponse> => {
  logger.info(requestContext, `${CreateInsight.name} controller called`)

  let response: ControllerResponse | null = null

  // Call core module
  const result: CoreAppResponse = await FetchInsightsPosts(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    queryParams,
    { projection: { _id: 0 } },
  )

  if (result.status !== ResponseStatusCodes.OK) {
    const errMsg = AppError.strigifyAppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${InsightErrorMessage.NO_RECORDS}${result.message}`,
      `${fileURLToPath(import.meta.url)} ${FetchInsights.name}`,
    )
    throw errMsg
  }

  response = {
    ...result,
  }

  logger.info(requestContext, `Insight fetched successfully`)
  return response
}
