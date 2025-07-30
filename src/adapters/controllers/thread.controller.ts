import { logger } from '@shared'
import { CreateThread, IThreadsDto, CoreResultInstance } from '@core'
import { AppError, ResponseStatusCodes } from '@shared'
import { ThreadsErrorMessage } from '../common/constants.js'
import { ControllerResponse, RequestContext } from '../common/types.js'
import { genStack } from '../common/utils.js'
import { ThreadDataAdapter } from '../database/index.js'

export const CreateThreadController = async (
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<ControllerResponse> => {
  logger.info(`${requestId}: ${CreateThread.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BadRequest,
      ThreadsErrorMessage.INVALID_PARAMS,
      `${genStack(import.meta.url)} - ${CreateThread.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${CreateThreadController.name}()`,
  )

  const result: CoreResultInstance = await CreateThread(
    {
      ThreadDataAdapter: new ThreadDataAdapter(),
    },
    body as unknown as IThreadsDto,
  )

  if (result.status !== ResponseStatusCodes.Created) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${ThreadsErrorMessage.FAILED_TO_CREATE_THREAD}${result.msg}`,
      `${genStack(import.meta.url)} - ${CreateThreadController.name}()`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: Thread created successfully`)

  response = {
    ...result,
  }

  return response
}
