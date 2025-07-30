import { IInsightDto } from '../entities/insight'

export interface IInsightDataStore {
  create(document: IInsightDto): Promise<unknown>
  read(
    filter?: Partial<IInsightDto>,
    projection?: Record<string, number>,
  ): Promise<unknown>
  aggregate(
    filter?: Partial<IInsightDto>,
    projection?: Record<string, number>,
  ): Promise<unknown>
  update(
    filter: Partial<IInsightDto>,
    document: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<unknown>
  // delete(): Promise<unknown>
}
