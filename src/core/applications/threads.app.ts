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

  const threadId = generateId()
  const path = generateThreadPath({ ...payload, threadId })
  const threadObj = {
    ...payload,
    threadId,
    path,
  }

  // Validate Hierarchy
  const { isValid: hierarchyIsValid, message: hierarchyValidationMessage } =
    Threads.validateHierarchy(threadObj)
  if (!hierarchyIsValid)
    throw new CoreAppError(
      AppResStatusCodes.CONFLICT,
      `${MODULE_NAME}: Invalid Thread Hierarchy: ${hierarchyValidationMessage}`,
    )

  // Create New Object
  const newThread = new Threads(threadObj)

  // Store it in DB
  response.queryResponse = await ThreadDataAdapter.create(newThread)
  response.uid = threadId
  response.status = AppResStatusCodes.CREATED

  return response
}
