import { fileURLToPath } from 'node:url'
import { IInsightDto, InsightEntity } from '../entities/insight.js'
import { StatusCodes, UserErrMsg, MODULE_NAME } from '../common/constants.js'
import { ErrorInst, ResultInst } from '../common/resultHandlers.js'
import { InsightAdapters } from '../common/types.js'
import { generateId } from '../common/utils.js'

/**
 * Creates a new insight and stores it in the database.
 *
 * @param adapters - An object containing the necessary adapters for the operation.
 * @param adapters.InsightDataAdapter - The data adapter for interacting with the insights database.
 * @param payload - The data transfer object containing the details of the insight to be Created.
 * @returns A promise that resolves to a ResultInst object containing the status and details of the operation.
 * @throws {ErrorInst} If the provided payload is invalid.
 */
export const CreateInsight = async (
  adapters: InsightAdapters,
  payload: IInsightDto,
): Promise<ResultInst> => {
  const { InsightDataAdapter } = adapters
  const response = new ResultInst()

  // Validate Payload
  const { isValid, err } = InsightEntity.validate(payload)
  if (!isValid)
    throw new ErrorInst(
      fileURLToPath(import.meta.url),
      `${MODULE_NAME}\nInvalid payload: ${err}`,
    )

  // Create New Object
  const insightId = generateId()
  const { payload: newInsight } = new InsightEntity({
    ...payload,
    insightId,
  })

  // Store it in DB
  response.qryRes = await InsightDataAdapter.create(newInsight)
  response.uid = insightId
  response.status = StatusCodes.Created

  return response
}

/**
 * Fetches insight posts based on the provided query parameters and options.
 *
 * @param adapters - An object containing the necessary adapters for fetching insights.
 * @param queryParams - Optional query parameters to filter the insights.
 * @param options - Optional settings for the fetch operation.
 * @param options.projection - A projection object to specify which fields to include or exclude.
 * @returns A promise that resolves to a ResultInst object containing the fetched insights.
 */
export const FetchInsights = async (
  adapters: InsightAdapters,
  queryParams?: Record<string, string> | undefined,
  options?: {
    projection: Record<string, number>
  },
): Promise<ResultInst> => {
  const { InsightDataAdapter } = adapters
  const response = new ResultInst()

  const { projection = {} } = options || {}
  let filter = {}
  if (queryParams) filter = queryParams

  const insightsData = await InsightDataAdapter.aggregate(filter, projection)

  if (Array.isArray(insightsData) && insightsData.length == 0) {
    response.status = StatusCodes.Ok
    response.msg = UserErrMsg.NoRecords
    return response
  }

  response.qryRes = insightsData

  return response
}

export const UpdateInsight = async (
  adapters: InsightAdapters,
  toUpdate: {
    filter: Partial<IInsightDto>
    document: Record<string, unknown>
    options?: Record<string, unknown>
  },
): Promise<ResultInst> => {
  const { InsightDataAdapter } = adapters
  const response = new ResultInst()

  const { filter, document, options } = toUpdate

  // Validate Payload
  if (!filter || !document)
    throw new ErrorInst(
      fileURLToPath(import.meta.url),
      `${MODULE_NAME}: ${UserErrMsg.InvalidParams}`,
    )

  response.qryRes = await InsightDataAdapter.update(filter, document, options)
  return response
}
