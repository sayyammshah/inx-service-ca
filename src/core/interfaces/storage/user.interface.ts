import { UserEntity as UserDto } from '../../business/entities/entity'

export default interface IUserStore {
  create(document: UserDto): Promise<unknown>
  read(
    filter?: Partial<UserDto>,
    projection?: Record<string, number>,
  ): Promise<unknown>
  // update(): Promise<unknown>
  // delete(): Promise<unknown>
  // aggregate(): Promise<unknown>
}
