import { ThreadEntity, IThreadsDto } from '../entities/thread.js'
import { StatusCodes, MODULE_NAME } from '../common/constants.js'
import { ErrorInst, ResultInst } from '../common/resultHandlers.js'
import { ThreadAdapters } from '../common/types.js'
import { generateId, generateThreadPath } from '../common/utils.js'
import { fileURLToPath } from 'node:url'

export const CreateThread = async (
  adapters: ThreadAdapters,
  payload: IThreadsDto,
): Promise<ResultInst> => {
  const { ThreadDataAdapter } = adapters
  const response = new ResultInst()

  // Validate Payload
  const { isValid, err } = ThreadEntity.validate(payload)
  if (!isValid)
    throw new ErrorInst(
      fileURLToPath(import.meta.url),
      `${MODULE_NAME}: Invalid Thread Object Provided: ${err}`,
    )

  const threadId = generateId()
  const path = generateThreadPath({ ...payload, threadId })
  const threadObj = {
    ...payload,
    threadId,
    path,
  }

  // Validate Hierarchy
  const { isValid: hierarchyIsValid, err: hierarchyValidationMessage } =
    ThreadEntity.validateHierarchy(threadObj)
  if (!hierarchyIsValid)
    throw new ErrorInst(
      fileURLToPath(import.meta.url),
      `${MODULE_NAME}: Invalid Thread Hierarchy: ${hierarchyValidationMessage}`,
      StatusCodes.Conflict,
    )

  // Create New Object
  const { payload: newThread } = new ThreadEntity(threadObj)

  // Store it in DB
  response.qryRes = await ThreadDataAdapter.create(newThread)
  response.uid = threadId
  response.status = StatusCodes.Created

  return response
}
