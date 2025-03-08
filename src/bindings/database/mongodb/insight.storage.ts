import { Db, Document, FindCursor, WithId } from 'mongodb'
import { InsightDto, Insights } from '@core/business'
import { InsightDataInterface } from '@core/storage-interface'
import { MongoDBClient } from '@infra/clients'
import { DATABASE_CONSTANTS } from '@bindings/common/constants.js'
import { logger } from 'shared/logger.js'

export class InsightDataAdapter implements InsightDataInterface {
  private collectionName = DATABASE_CONSTANTS.COLLECTIONS.INSIGHTS
  private client: Db | null = null

  private async getClient(): Promise<Db> {
    if (!this.client) {
      this.client = await MongoDBClient.getInstance()
    }
    return await MongoDBClient.getInstance()
  }

  async create(document: Insights): Promise<unknown> {
    try {
      if (!this.client) this.client = await this.getClient()

      const response = await this.client
        .collection(this.collectionName)
        .insertOne(document)

      return response
    } catch (error) {
      const errorMessage = `Error creating new insight: ${error instanceof Error ? `${error.message}` : `${error}`}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async read(
    filter?: unknown,
    projection?: Record<string, number>,
  ): Promise<unknown> {
    try {
      if (!this.client) this.client = await this.getClient()

      const response = await this.client
        .collection(this.collectionName)
        .find(filter as FindCursor<WithId<Document>>, {
          projection,
        })
        .toArray()

      return response
    } catch (error) {
      const errorMessage = `Error fetching insights: ${error instanceof Error ? `${error.message}` : `${error}`}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }

  async aggregate(
    filter?: Partial<InsightDto>,
    projection?: Record<string, number>,
  ): Promise<unknown> {
    try {
      if (!this.client) this.client = await this.getClient()

      const pipeline: Document[] = [
        {
          $match: filter,
        },
        {
          $lookup: {
            from: DATABASE_CONSTANTS.COLLECTIONS.THREADS,
            localField: 'insightId',
            foreignField: 'insightId',
            as: 'threads',
          },
        },
        {
          $project: projection,
        },
      ]
      const response = await this.client
        .collection(this.collectionName)
        .aggregate(pipeline)
        .toArray()
      return response
    } catch (error) {
      const errorMessage = `Error fetching user: ${error instanceof Error ? `${error.message}` : `${error}`}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
