import { User } from '@core/business'
import { UserDataInterface } from '@core/database-interface'
import { COLLECTION_NAMES } from 'bindings/common/constants.js'
import { MongoDBClient } from 'infrastructure/clients/mongodb.js'
import { Db } from 'mongodb'

export class UserDataAdapter implements UserDataInterface {
  async create(document: User): Promise<unknown> {
    const collectionName = COLLECTION_NAMES.USER

    try {
      const databaseClient: Db = await MongoDBClient.getInstance()

      const response = await databaseClient
        .collection(collectionName)
        .insertOne(document)

      return response
    } catch (error) {
      const errorMessage = `Error creating new user: ${error instanceof Error ? `${error.message}` : `${error}`}`
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
  }
}
