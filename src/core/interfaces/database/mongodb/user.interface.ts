import { User } from '@core/business'

export interface UserDataInterface {
  create(document: User): Promise<unknown>
  // read(): Promise<unknown>
  // update(): Promise<unknown>
  // delete(): Promise<unknown>
  // aggregate(): Promise<unknown>
}
