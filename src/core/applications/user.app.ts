import { StatusCodes, MODULE_NAME, UserErrMsg } from '../common/constants'
import { ErrorInst, ResultInst } from '../common/resultHandlers'
import { fileURLToPath } from 'node:url'
import { UserEntity as UserDto } from '../business/entities/entity'
import User from '../business/entities/user'
import { generateId, hashManager } from '../common/utils'
import { UserAdapters } from '../common/types'

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
export const CreateUser = async (
  adapters: UserAdapters,
  payload: UserDto,
): Promise<ResultInst> => {
  const { UserDataAdapter } = adapters
  const response = new ResultInst()

  const { isValid, err } = User.validate(payload)
  if (!isValid)
    throw new ErrorInst(
      fileURLToPath(__filename),
      `${MODULE_NAME}: Invalid user dto provided: ${err}`,
    )

  const filter = {
    email: payload.email,
  }

  const userAlreadyExists = await UserDataAdapter.read(filter)

  if (Array.isArray(userAlreadyExists) && userAlreadyExists.length > 0) {
    response.status = StatusCodes.Conflict
    response.msg = UserErrMsg.UserExists
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
  response.qryRes = await UserDataAdapter.create(newUser)
  response.status = StatusCodes.Created

  return response
}

export const AuthenticateUser = async (
  adapters: UserAdapters,
  payload: UserDto,
  options?: {
    projection: Record<string, number>
  },
): Promise<ResultInst> => {
  const { UserDataAdapter } = adapters
  const response = new ResultInst()

  const { isValid, err } = User.validate(payload, true)
  if (!isValid)
    throw new ErrorInst(
      fileURLToPath(__filename),
      `${MODULE_NAME}: Invalid user dto provided: ${err}`,
    )

  const { projection = {} } = options || {}

  const filter = {
    email: payload.email,
  }

  const userData = await UserDataAdapter.read(filter, projection)

  if (Array.isArray(userData) && userData.length == 0) {
    response.status = StatusCodes.NotFound
    response.msg = UserErrMsg.UserNotFound
    return response
  }

  const { password, userId } = Array.isArray(userData) ? userData[0] : {}

  const { isValid: passwordIsValid, message: tokenValidationMessage } =
    hashManager().verify(password, payload.password)

  if (!passwordIsValid) {
    response.status = StatusCodes.BadRequest
    response.msg = tokenValidationMessage
    return response
  }

  response.uid = userId
  response.qryRes = userData

  return response
}
