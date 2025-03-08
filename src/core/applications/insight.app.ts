import { InsightDto, Insights } from '@core/business'
import {
  AppResStatusCodes,
  CoreUserErrorMsg,
  MODULE_NAME,
} from '@core/common/constants.js'
import { CoreAppError, CoreAppResponse } from '@core/common/coreAppResponse.js'
import { InsightAdapters } from '@core/common/types.js'
import { generateId } from '@core/common/utils.js'

/**
 * Creates a new insight and stores it in the database.
 *
 * @param adapters - An object containing the necessary adapters for the operation.
 * @param adapters.InsightDataAdapter - The data adapter for interacting with the insights database.
 * @param payload - The data transfer object containing the details of the insight to be created.
 * @returns A promise that resolves to a CoreAppResponse object containing the status and details of the operation.
 * @throws {CoreAppError} If the provided payload is invalid.
 */
export const CreateNewInsight = async (
  adapters: InsightAdapters,
  payload: InsightDto,
): Promise<CoreAppResponse> => {
  const { InsightDataAdapter } = adapters
  const response = new CoreAppResponse()

  // Validate Payload
  const { isValid, message } = Insights.validate(payload)
  if (!isValid)
    throw new CoreAppError(
      AppResStatusCodes.BAD_REQUEST,
      `${MODULE_NAME}: Invalid Insight Object Provided: ${message}`,
    )

  // Create New Object
  const insightId = generateId()
  const newInsight = new Insights({
    ...payload,
    insightId,
  })

  // Store it in DB
  response.queryResponse = await InsightDataAdapter.create(newInsight)
  response.uid = insightId
  response.status = AppResStatusCodes.CREATED

  return response
}

/**
 * Fetches insight posts based on the provided query parameters and options.
 *
 * @param adapters - An object containing the necessary adapters for fetching insights.
 * @param queryParams - Optional query parameters to filter the insights.
 * @param options - Optional settings for the fetch operation.
 * @param options.projection - A projection object to specify which fields to include or exclude.
 * @returns A promise that resolves to a CoreAppResponse object containing the fetched insights.
 */
export const FetchInsightsPosts = async (
  adapters: InsightAdapters,
  queryParams?: Record<string, string> | undefined,
  options?: {
    projection: Record<string, number>
  },
): Promise<CoreAppResponse> => {
  const { InsightDataAdapter } = adapters
  const response = new CoreAppResponse()

  const { projection = {} } = options || {}
  let filter = {}
  if (queryParams) filter = queryParams

  const insightsData = await InsightDataAdapter.read(filter, projection)

  if (Array.isArray(insightsData) && insightsData.length == 0) {
    response.status = AppResStatusCodes.OK
    response.message = CoreUserErrorMsg.NO_RECORDS
    return response
  }

  response.queryResponse = insightsData

  return response
}
