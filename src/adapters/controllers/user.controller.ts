import { fileURLToPath } from 'node:url'
import {
  IUserDto,
  CoreResultInstance,
  CreateUser,
  AuthenticateUser,
} from '@core'
import { logger, AppError, ResponseStatusCodes } from '@shared'
import { ControllerResponse, RequestContext } from '../common/types.js'
import { genStack, tokenManager } from '../common/utils.js'
import { DATABASE_CONSTANTS, UserErrorMsg } from '../common/constants.js'
import { UserDataAdapter } from '../database/index.js'

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
export async function CreateUserController(
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<ControllerResponse> {
  logger.info(`${requestId}: ${CreateUserController.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BadRequest,
      UserErrorMsg.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} - ${CreateUserController.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${CreateUserController.name}()`,
  )

  const result: CoreResultInstance = await CreateUser(
    {
      UserDataAdapter: new UserDataAdapter(),
    },
    body as unknown as IUserDto,
  )

  if (result.status !== ResponseStatusCodes.Created) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${UserErrorMsg.FAILED_ACCOUNT_CREATION}${result.msg}`,
      `${genStack(import.meta.url)} - ${CreateUserController.name}()`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: User created successfully`)

  // Generate Token - Attached it to Response
  logger.info(`${requestId}: Generating token`)
  const token: string = tokenManager().generate({
    userId: result.uid,
    name: body.name as string,
    email: body.email as string,
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
export async function AuthenticateUserController(
  body: Record<string, unknown>,
  { requestId }: RequestContext,
): Promise<ControllerResponse> {
  logger.info(
    `${requestId}: ${AuthenticateUserController.name} controller called`,
  )

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BadRequest,
      UserErrorMsg.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} - ${AuthenticateUserController.name}()`,
    )
    throw appError
  }

  // Call core module
  logger.info(
    `${requestId}: Core module process initiated - ${AuthenticateUserController.name}()`,
  )

  const result = await AuthenticateUser(
    {
      UserDataAdapter: new UserDataAdapter(),
    },
    body as unknown as IUserDto,
    { projection: DATABASE_CONSTANTS.PROJECTIONS.USER },
  )

  if (result.status !== ResponseStatusCodes.Ok) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.InternalServerError,
      `${UserErrorMsg.FAILED_ACCOUNT_AUTH}${result.msg}`,
      `${fileURLToPath(import.meta.url)} - ${AuthenticateUserController.name}()`,
    )
    throw errMsg
  }

  logger.info(`${requestId}: User authenticated`)

  // Generate Token - Attached it to Response
  logger.info(`${requestId}: Generating token`)
  const token: string = tokenManager().generate({
    userId: result.uid,
    name: body.name as string,
    email: body.email as string,
  })
  response = {
    ...result,
    token,
  }
  return response
}
