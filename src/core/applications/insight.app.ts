import { InsightDto, Insights } from '@core/business'
import { AppResStatusCodes, MODULE_NAME } from '@core/common/constants.js'
import { CoreAppError, CoreAppResponse } from '@core/common/coreAppResponse.js'
import { InsightAdapters } from '@core/common/types.js'
import { generateId } from '@core/common/utils.js'

export const CreateInsightPost = async (
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
