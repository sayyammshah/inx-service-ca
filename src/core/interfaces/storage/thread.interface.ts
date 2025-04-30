import { Threads } from '@core/business'

export interface ThreadDataInterface {
  create(document: Threads, isTopLevelComment?: boolean): Promise<unknown>
  // read(
  //   filter?: Partial<ThreadsDto>,
  //   projection?: Record<string, number>,
  // ): Promise<unknown>
  // update(): Promise<unknown>
  // delete(): Promise<unknown>
  // aggregate(): Promise<unknown>
}
