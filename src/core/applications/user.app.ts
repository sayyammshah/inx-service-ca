import { UserDataInterface } from '@core/storage-interface'
import { User, UserDto } from '@core/business'
import { generateId, hashManager, tokenManager } from '@core/common/utils.js'
import { AppCreateUserResponse } from '@core/common/types.js'
import { AppResponseStatus } from '@core/common/constants.js'

export const CreateUserAccount = async (
  userDataAdapter: UserDataInterface,
  payload: UserDto,
): Promise<AppCreateUserResponse> => {
  const { isValid, message } = User.validate(payload)
  if (!isValid) throw new Error(`Invalid User Object Provided: ${message}`)

  const filter = {
    email: payload.email,
  }
  const response: AppCreateUserResponse = {
    userId: '',
    token: '',
    queryResponse: null,
    message: '',
    status: AppResponseStatus.SUCCESS,
  }
  const userAlreadyExists = await userDataAdapter.read(filter)

  if (Array.isArray(userAlreadyExists) && userAlreadyExists.length > 0) {
    response.status = AppResponseStatus.ERROR
    response.message = 'User already exists'
    return response
  }

  const userId = generateId()
  const hashedPassword = hashManager().generate(payload.password)

  const newUser = new User({
    ...payload,
    userId,
    password: hashedPassword,
  })

  const { name, email } = newUser

  response.userId = userId
  response.queryResponse = await userDataAdapter.create(newUser)
  response.token = tokenManager().generate({
    userId,
    name,
    email,
  })

  return response
}
