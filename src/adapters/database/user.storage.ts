import { Db, FindCursor, WithId } from 'mongodb'
import { UserDataInterface, IUserDto } from '@core'
import { MongoDBClient } from '@infra'
import { logger } from '@shared'
import { DATABASE_CONSTANTS } from '../common/constants.js'

export default class UserDataStore implements UserDataInterface {
  private collectionName = DATABASE_CONSTANTS.COLLECTIONS.USERS
  private client: Db | null = null

  private async getClient(): Promise<Db> {
    if (!this.client) {
      this.client = await MongoDBClient.getInstance()
    }
    return await MongoDBClient.getInstance()
  }

  async create(document: IUserDto): Promise<unknown> {
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
