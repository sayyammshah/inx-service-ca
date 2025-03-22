import { ThreadsErrorMessage } from '@bindings/common/constants.js'
import { ControllerResponse, RequestContext } from '@bindings/common/types.js'
import { genStack } from '@bindings/common/utils.js'
import { ThreadDataAdapter } from '@bindings/mongo-database'
import { CreateNewThread } from '@core/app'
import { generateThreadsDto, ThreadsDto } from '@core/business'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'
import { AppError } from 'shared/apiResponseCls.js'
import { ResponseStatusCodes } from 'shared/constants.js'
import { logger } from 'shared/logger.js'

export const CreateThread = async (
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<CoreAppResponse> => {
  logger.info(`${requestId}: ${CreateThread.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BAD_REQUEST,
      ThreadsErrorMessage.INVALID_PARAMS,
      `${genStack(import.meta.url)} - ${CreateThread.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${CreateNewThread.name}()`,
  )
  const payload: ThreadsDto = generateThreadsDto(body)
  const result: CoreAppResponse = await CreateNewThread(
    {
      ThreadDataAdapter: new ThreadDataAdapter(),
    },
    payload,
  )

  if (result.status !== ResponseStatusCodes.CREATED) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${ThreadsErrorMessage.FAILED_TO_CREATE_THREAD}${result.message}`,
      `${genStack(import.meta.url)} - ${CreateThread.name}()`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: Thread created successfully`)

  response = {
    ...result,
  }

  return response
}
