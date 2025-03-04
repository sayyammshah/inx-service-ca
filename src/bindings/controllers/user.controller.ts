import { generateUserDto, UserDto } from '@core/business'
import { AuthenticateUserAccount, CreateUserAccount } from '@core/app'
import { UserDataAdapter } from '@bindings/mongo-database'
import { logger } from 'shared/logger.js'
import { ControllerResponse, RequestContext } from '@bindings/common/types.js'
import { tokenManager } from '@bindings/common/utils.js'
import { ResponseStatusCodes } from 'shared/constants.js'
import { AppError } from 'shared/apiResponseCls.js'
import { fileURLToPath } from 'node:url'
import { USER_PROJECTIONS, UserErrorMsg } from '@bindings/common/constants.js'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'

/**
 * This function is responsible for creating a new user account.
 * It takes a body object containing user details as input and returns a ControllerResponse.
 *
 * @param body - An object containing user details. The keys can be any string, but the values must be either a string or a number.
 * @returns A Promise that resolves to a ControllerResponse.
 *
 * @throws AppError - If the input body is empty, an AppError is thrown with a BAD_REQUEST status code and an appropriate error message.
 * @throws AppError - If an error occurs while creating the user account, an AppError is thrown with the corresponding status code and error message.
 */
export async function CreateUser(
  body: {
    [key: string]: string | number
  },
  requestContext: RequestContext,
): Promise<ControllerResponse> {
  logger.info(requestContext, `${CreateUser.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = AppError.strigifyAppError(
      ResponseStatusCodes.BAD_REQUEST,
      UserErrorMsg.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} ${CreateUser.name}`,
    )
    throw appError
  }

  // Call core module
  logger.info(requestContext, `preparing payload DTO`)
  const payload: UserDto = generateUserDto(body)
  const result: CoreAppResponse = await CreateUserAccount(
    {
      UserDataAdapter: new UserDataAdapter(),
    },
    payload,
  )

  if (result.status !== ResponseStatusCodes.CREATED) {
    const errMsg = AppError.strigifyAppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${UserErrorMsg.FAILED_ACCOUNT_CREATION}${result.message}`,
      `${fileURLToPath(import.meta.url)} ${CreateUser.name}`,
    )
    throw errMsg
  }
  // Generate Token - Attached it to Response
  logger.info(requestContext, `Generating Token`)
  const token: string = tokenManager().generate({
    userId: result.uid,
    name: payload.name,
    email: payload.email,
  })
  response = {
    ...result,
    token,
  }

  logger.info(requestContext, `User created successfully`)
  return response
}

/**
 * This function is responsible for authenticating a user account.
 * It takes a body object containing user details and a request context as input,
 * and returns a Promise that resolves to a ControllerResponse.
 *
 * @param body - An object containing user details. The keys can be any string, but the values must be either a string or a number.
 * @param requestContext - An object containing contextual information about the request.
 *
 * @returns A Promise that resolves to a ControllerResponse.
 * The ControllerResponse object contains the status code, message, and optionally, the user data and token.
 *
 * @throws AppError - If the input body is empty, an AppError is thrown with a BAD_REQUEST status code and an appropriate error message.
 * @throws AppError - If an error occurs while authenticating the user account, an AppError is thrown with the corresponding status code and error message.
 */
export async function AuthenticateUser(
  body: {
    [key: string]: string | number
  },
  requestContext: RequestContext,
): Promise<ControllerResponse> {
  logger.info(requestContext, `${AuthenticateUser.name} controller called`)

  let response: ControllerResponse | null = null

  if (Object.keys(body).length === 0) {
    const appError = new AppError(
      ResponseStatusCodes.BAD_REQUEST,
      UserErrorMsg.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} ${AuthenticateUser.name}`,
    )
    throw appError
  }

  // Call core module
  logger.info(requestContext, `Preparing payload DTO`)
  const payload: UserDto = generateUserDto(body)
  const result = await AuthenticateUserAccount(
    {
      UserDataAdapter: new UserDataAdapter(),
    },
    payload,
    { projection: USER_PROJECTIONS },
  )

  if (result.status !== ResponseStatusCodes.OK) {
    const errMsg = new AppError(
      result.status ?? ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      `${UserErrorMsg.FAILED_ACCOUNT_AUTH}${result.message}`,
      `${fileURLToPath(import.meta.url)} ${AuthenticateUser.name}`,
    )
    throw errMsg
  }

  // Generate Token - Attached it to Response
  logger.info(requestContext, `Generating Token`)
  const token: string = tokenManager().generate({
    userId: result.uid,
    name: payload.name,
    email: payload.email,
  })
  response = {
    ...result,
    token,
  }

  logger.info(requestContext, `User authenticated successfully`)
  return response
}
