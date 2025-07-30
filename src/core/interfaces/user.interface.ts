import { IUserDto } from '../entities/user.js'

export interface IUserDataStore {
  create(document: IUserDto): Promise<unknown>
  read(
    filter?: Partial<IUserDto>,
    projection?: Record<string, number>,
  ): Promise<unknown>
  // update(): Promise<unknown>
  // delete(): Promise<unknown>
  // aggregate(): Promise<unknown>
}
