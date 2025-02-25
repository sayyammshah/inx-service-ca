import { UserDataAdapter } from 'bindings/database/mongodb/user.storage.js'
import { CreateUserAccount } from 'core/applications/user.app.js'
import { UserDto } from 'core/business/dto/dto.js'
import { generateUserDto } from 'core/business/dto/mapper.js'

export async function CreateUser(body: {
  [key: string]: string | number
}): Promise<unknown> {
  let response: unknown = null

  if (Object.keys(body).length === 0) throw new Error('Invalid Params')

  // Deps Injections
  const userDataAdapter = new UserDataAdapter()

  // Call application from core module
  const payload: UserDto = generateUserDto(body)
  response = await CreateUserAccount(userDataAdapter, payload)

  // handler response
  return response
}
