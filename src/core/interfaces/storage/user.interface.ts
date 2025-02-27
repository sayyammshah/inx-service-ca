import { User, UserDto } from '@core/business'

export interface UserDataInterface {
  create(document: User): Promise<unknown>
  read(
    filter?: Partial<UserDto>,
    projection?: Record<string, number>,
  ): Promise<unknown>
  // update(): Promise<unknown>
  // delete(): Promise<unknown>
  // aggregate(): Promise<unknown>
}
