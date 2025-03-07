import { Threads, ThreadsDto } from '@core/business'
import { AppResStatusCodes, MODULE_NAME } from '@core/common/constants.js'
import { CoreAppError, CoreAppResponse } from '@core/common/coreAppResponse.js'
import { ThreadAdapters } from '@core/common/types.js'
import { generateId, generateThreadPath } from '@core/common/utils.js'

export const CreateNewThread = async (
  adapters: ThreadAdapters,
  payload: ThreadsDto,
): Promise<CoreAppResponse> => {
  const { ThreadDataAdapter } = adapters
  const response = new CoreAppResponse()

  // Validate Payload
  const { isValid, message } = Threads.validate(payload)
  if (!isValid)
    throw new CoreAppError(
      AppResStatusCodes.BAD_REQUEST,
      `${MODULE_NAME}: Invalid Thread Object Provided: ${message}`,
    )

  // Create New Object
  const threadId = generateId()
  const path = generateThreadPath({ ...payload, threadId })
  const newThread = new Threads({
    ...payload,
    threadId,
    path,
  })

  // Store it in DB
  response.queryResponse = await ThreadDataAdapter.create(newThread)
  response.uid = threadId
  response.status = AppResStatusCodes.CREATED

  return response
}
