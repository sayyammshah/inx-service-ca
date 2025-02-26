import { generateUserDto, UserDto } from '@core/business'
import { CreateUserAccount } from '@core/app'
import { UserDataAdapter } from '@bindings/mongo-database'
import { logger } from 'shared/logger.js'

export async function CreateUser(body: {
  [key: string]: string | number
}): Promise<unknown> {
  logger.info('CreateUser controller called')

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
