import { IThreadsDto } from '../entities/thread.js'

export interface IThreadDataStore {
  create(document: IThreadsDto): Promise<unknown>
  // read(
  //   filter?: Partial<ThreadsDto>,
  //   projection?: Record<string, number>,
  // ): Promise<unknown>
  // update(): Promise<unknown>
  // delete(): Promise<unknown>
  // aggregate(): Promise<unknown>
}
