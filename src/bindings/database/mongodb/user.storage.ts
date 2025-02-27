import { Db, FindCursor, WithId } from 'mongodb'
import { User } from '@core/business'
import { UserDataInterface } from '@core/storage-interface'
import { MongoDBClient } from '@infra/clients'
import { COLLECTION_NAMES } from '@bindings/common/constants.js'
import { logger } from 'shared/logger.js'

export class UserDataAdapter implements UserDataInterface {
  private collectionName = COLLECTION_NAMES.USER
  private client: Db | null = null

  private async getClient(): Promise<Db> {
    if (!this.client) {
      this.client = await MongoDBClient.getInstance()
    }
    return await MongoDBClient.getInstance()
  }

  async create(document: User): Promise<unknown> {
    try {
      if (!this.client) this.client = await this.getClient()

      const response = await this.client
        .collection(this.collectionName)
        .insertOne(document)

      return response
    } catch (error) {
      const errorMessage = `Error creating new user: ${error instanceof Error ? `${error.message}` : `${error}`}`
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
      const errorMessage = `Error fetching user: ${error instanceof Error ? `${error.message}` : `${error}`}`
      logger.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
