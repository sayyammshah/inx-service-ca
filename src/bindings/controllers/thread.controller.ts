import { ThreadsErrorMessage } from '@bindings/common/constants.js'
import { ControllerResponse, RequestContext } from '@bindings/common/types.js'
import { ThreadDataAdapter } from '@bindings/mongo-database'
import { CreateNewThread } from '@core/app'
import { generateThreadsDto, ThreadsDto } from '@core/business'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'
import { fileURLToPath } from 'node:url'
import { AppError } from 'shared/apiResponseCls.js'
import { ResponseStatusCodes } from 'shared/constants.js'
import { logger } from 'shared/logger.js'

export const CreateThread = async (
  body: {
    [key: string]: string | number
  },
  requestContext: RequestContext,
): Promise<CoreAppResponse> => {
  logger.info(requestContext, `${CreateThread.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BAD_REQUEST,
      ThreadsErrorMessage.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} ${CreateThread.name}`,
    )
    throw appError
  }

  // Call core module
  logger.info(requestContext, `preparing payload DTO`)
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
      `${fileURLToPath(import.meta.url)} ${CreateThread.name}`,
    )
    throw errMsg
  }

  response = {
    ...result,
  }

  logger.info(requestContext, `Thread created successfully`)
  return response
}
