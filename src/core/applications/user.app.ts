import { User } from '@core/business'
import { UserDataInterface } from '@core/database-interface'
import { generateId } from 'core/business/common/utils.js'
import { UserDto } from 'core/business/dto/dto.js'

export const CreateUserAccount = async (
  userDataAdapter: UserDataInterface,
  payload: UserDto,
): Promise<unknown> => {
  const { isValid, message } = User.validate(payload)

  if (!isValid) throw new Error(`Invalid User Object Provided: ${message}`)

  const newUser = new User({
    userId: generateId(),
    ...payload,
  })

  return await userDataAdapter.create(newUser)
}
