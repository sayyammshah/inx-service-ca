import { Insights, InsightDto } from '@core/business'

export interface InsightDataInterface {
  create(document: Insights): Promise<unknown>
  read(
    filter?: Partial<InsightDto>,
    projection?: Record<string, number>,
  ): Promise<unknown>
  aggregate(
    filter?: Partial<InsightDto>,
    projection?: Record<string, number>,
  ): Promise<unknown>
  update(
    filter: Partial<InsightDto>,
    document: Record<string, unknown>,
    options?: Record<string, unknown>,
  ): Promise<unknown>
  // delete(): Promise<unknown>
}
