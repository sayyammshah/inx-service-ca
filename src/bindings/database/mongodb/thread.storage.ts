import { Db } from 'mongodb'
import { ThreadDataInterface } from '@core/storage-interface'
import { MongoDBClient } from '@infra/clients'
import { DATABASE_CONSTANTS } from '@bindings/common/constants.js'
import { logger } from 'shared/logger.js'
import { Threads } from '@core/business'

export class ThreadDataAdapter implements ThreadDataInterface {
  private collectionName = DATABASE_CONSTANTS.COLLECTIONS.THREADS
  private client: Db | null = null

  private async getClient(): Promise<Db> {
    if (!this.client) {
      this.client = await MongoDBClient.getInstance()
    }
    return await MongoDBClient.getInstance()
  }

  async create(document: Threads): Promise<unknown> {
    try {
      if (!this.client) this.client = await this.getClient()

      const response = await this.client
        .collection(this.collectionName)
        .insertOne(document)

      return response
    } catch (error) {
      const errorMessage = `Error creating new thread: ${error instanceof Error ? `${error.message}` : `${error}`}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
