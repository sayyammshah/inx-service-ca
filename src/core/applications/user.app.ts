import { User, UserDto } from '@core/business'
import { generateId, hashManager } from '@core/common/utils.js'
import { Adapters, CoreAppResponse } from '@core/common/types.js'
import { AppResStatusCodes } from '@core/common/constants.js'

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
  adapters: Adapters,
  payload: UserDto,
): Promise<CoreAppResponse> => {
  const { isValid, message } = User.validate(payload)
  if (!isValid) throw new Error(`Invalid User Object Provided: ${message}`)

  const { UserDataAdapter } = adapters

  const filter = {
    email: payload.email,
  }
  const response: CoreAppResponse = {
    uid: '',
    queryResponse: null,
    message: '',
    status: AppResStatusCodes.CREATED,
  }
  const userAlreadyExists = await UserDataAdapter.read(filter)

  if (Array.isArray(userAlreadyExists) && userAlreadyExists.length > 0) {
    response.status = AppResStatusCodes.BAD_REQUEST
    response.message = 'User already exists'
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
