import { generateUserDto, UserDto, CoreResultInstance } from '@core/shared'
import { logger } from '@shared/logger'
import { AppError } from '@shared/apiResponseCls'
import { ResponseStatusCodes } from '@shared/constants'
import { AuthenticateUserAccount, CreateUserAccount } from '@core/apps'
import { UserDataAdapter } from '../database/mongodb/index'
import { ControllerResponse, RequestContext } from '../common/types'
import { genStack, tokenManager } from '../common/utils'
import { DATABASE_CONSTANTS, UserErrorMsg } from '../common/constants'

/**
 * This function is responsible for creating a new user account.
 * It takes a body object containing user details as input and returns a ControllerResponse.
 *
 * @param body - An object containing user details.
 * @returns A Promise that resolves to a ControllerResponse.
 *
 * @throws AppError - If the input body is empty, an AppError is thrown with a BAD_REQUEST status code and an appropriate error message.
 * @throws AppError - If an error occurs while creating the user account, an AppError is thrown with the corresponding status code and error message.
 */
export async function CreateUser(
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<ControllerResponse> {
  logger.info(`${requestId}: ${CreateUser.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BadRequest,
      UserErrorMsg.INVALID_PARAMS,
      `${genStack(__filename)} - ${CreateUser.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${CreateUserAccount.name}()`,
  )
  const payload: UserDto = generateUserDto(body)

  const result: CoreResultInstance = await CreateUserAccount(
    {
      UserDataAdapter: new UserDataAdapter(),
    },
    payload,
  )

  if (result.status !== ResponseStatusCodes.Created) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${UserErrorMsg.FAILED_ACCOUNT_CREATION}${result.msg}`,
      `${genStack(__filename)} - ${CreateUser.name}()`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: User created successfully`)

  // Generate Token - Attached it to Response
  logger.info(`${requestId}: Generating token`)
  const token: string = tokenManager().generate({
    userId: result.uid,
    name: payload.name,
    email: payload.email,
  })
  response = {
    ...result,
    token,
  }
  return response
}

/**
 * This function is responsible for authenticating a user account.
 * It takes a body object containing user details and a request context as input,
 * and returns a Promise that resolves to a ControllerResponse.
 *
 * @param body - An object containing user details..
 * @param requestContext - An object containing contextual information about the request.
 *
 * @returns A Promise that resolves to a ControllerResponse.
 * The ControllerResponse object contains the status code, message, and optionally, the user data and token.
 *
 * @throws AppError - If the input body is empty, an AppError is thrown with a BAD_REQUEST status code and an appropriate error message.
 * @throws AppError - If an error occurs while authenticating the user account, an AppError is thrown with the corresponding status code and error message.
 */
export async function AuthenticateUser(
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<ControllerResponse> {
  logger.info(`${requestId}: ${AuthenticateUser.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BadRequest,
      UserErrorMsg.INVALID_PARAMS,
      `${genStack(__filename)} - ${AuthenticateUser.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${AuthenticateUserAccount.name}()`,
  )
  const payload: UserDto = generateUserDto(body)
  const result = await AuthenticateUserAccount(
    {
      UserDataAdapter: new UserDataAdapter(),
    },
    payload,
    { projection: DATABASE_CONSTANTS.PROJECTIONS.USER },
  )

  if (result.status !== ResponseStatusCodes.Ok) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${UserErrorMsg.FAILED_ACCOUNT_AUTH}${result.msg}`,
      `${genStack(__filename)} - ${AuthenticateUser.name}()`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: User authenticated`)

  // Generate Token - Attached it to Response
  logger.info(`${requestId}: Generating token`)
  const token: string = tokenManager().generate({
    userId: result.uid,
    name: payload.name,
    email: payload.email,
  })
  response = {
    ...result,
    token,
  }
  return response
}
