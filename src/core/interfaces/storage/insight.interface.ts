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
    filter: Record<keyof InsightDto, string>,
    query: { [key: string]: Partial<InsightDto> },
    options?: Record<string, string>,
  ): Promise<unknown>
  // delete(): Promise<unknown>
}
