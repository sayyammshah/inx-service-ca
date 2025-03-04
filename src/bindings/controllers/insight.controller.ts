import { RequestContext } from '@bindings/common/types.js'
import { InsightDataAdapter } from '@bindings/mongo-database'
import { CreateInsightPost } from '@core/app'
import { generateInsightDto, InsightDto } from '@core/business'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'

export const CreateInsight = async (
  body: {
    [key: string]: string | number
  },
  requestContext: RequestContext,
): Promise<CoreAppResponse> => {
  const payload: InsightDto = generateInsightDto(body)
  const result: CoreAppResponse = await CreateInsightPost(
    {
      InsightDataAdapter: new InsightDataAdapter(),
    },
    payload,
  )

  return result
}
