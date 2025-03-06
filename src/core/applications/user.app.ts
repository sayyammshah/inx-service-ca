import { User, UserDto } from '@core/business'
import { generateId, hashManager } from '@core/common/utils.js'
import { UserAdapters } from '@core/common/types.js'
import {
  AppResStatusCodes,
  CoreUserErrorMsg,
  MODULE_NAME,
} from '@core/common/constants.js'
import { CoreAppError, CoreAppResponse } from '@core/common/coreAppResponse.js'

/**
 * Creates a new user account in the system.
 *
 * @remarks
 * This function validates the provided user data, checks if the user already exists,
 * hashes the password, and creates a new user record in the database.
 *
 * @param adapters - An object containing the necessary adapters.
 * @param payload - The user data to be stored in the database.
 * @throws Will throw an error if the provided user data is invalid.
 * @returns A promise that resolves to a CoreAppResponse object containing the user ID,
 *          the query response, a message, and a status code.
 */
export const CreateUserAccount = async (
  adapters: UserAdapters,
  payload: UserDto,
): Promise<CoreAppResponse> => {
  const { UserDataAdapter } = adapters
  const response = new CoreAppResponse()

  const { isValid, message } = User.validate(payload)
  if (!isValid)
    throw new CoreAppError(
      AppResStatusCodes.BAD_REQUEST,
      `${MODULE_NAME}: Invalid User Object Provided: ${message}`,
    )

  const filter = {
    email: payload.email,
  }

  const userAlreadyExists = await UserDataAdapter.read(filter)

  if (Array.isArray(userAlreadyExists) && userAlreadyExists.length > 0) {
    response.status = AppResStatusCodes.CONFLICT
    response.message = CoreUserErrorMsg.USER_EXISTS
    return response
  }

  const userId: string = generateId()
  const hashedPassword: string = hashManager().generate(payload.password)

  const newUser = new User({
    ...payload,
    userId,
    password: hashedPassword,
  })

  response.uid = userId
  response.queryResponse = await UserDataAdapter.create(newUser)

  return response
}

export const AuthenticateUserAccount = async (
  adapters: UserAdapters,
  payload: UserDto,
  options?: {
    projection: Record<string, number>
  },
): Promise<CoreAppResponse> => {
  const { UserDataAdapter } = adapters
  const response = new CoreAppResponse()

  const { isValid, message } = User.validate(payload, true)
  if (!isValid)
    throw new CoreAppError(
      AppResStatusCodes.BAD_REQUEST,
      `${MODULE_NAME}: Invalid User Object Provided: ${message}`,
    )

  const { projection = {} } = options || {}

  const filter = {
    email: payload.email,
  }

  const userData = await UserDataAdapter.read(filter, projection)

  if (Array.isArray(userData) && userData.length == 0) {
    response.status = AppResStatusCodes.NOT_FOUND
    response.message = CoreUserErrorMsg.USER_NOT_FOUND
    return response
  }

  const { password, userId } = Array.isArray(userData) ? userData[0] : {}

  const { isValid: passwordIsValid, message: tokenValidationMessage } =
    hashManager().verify(password, payload.password)

  if (!passwordIsValid) {
    response.status = AppResStatusCodes.BAD_REQUEST
    response.message = tokenValidationMessage
    return response
  }

  response.uid = userId
  response.queryResponse = userData

  return response
}
