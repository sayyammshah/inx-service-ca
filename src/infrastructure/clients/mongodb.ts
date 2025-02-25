import { Db, MongoClient } from 'mongodb'

export class MongoDBClient {
  private static _client: MongoClient | null = null
  private static _instance: Db | null = null

  private constructor() {
    // Private Constructor
  }

  public static async initiateDatabaseConnection(): Promise<void> {
    const connectionString: string = process.env.DB_CONNECTION_URL as string
    const databaseName: string = process.env.DB_NAME as string

    if (!connectionString || !databaseName)
      throw new Error('Database credentials not found')

    try {
      this._client = new MongoClient(connectionString, {
        maxIdleTimeMS: 5000,
        maxPoolSize: 100,
        connectTimeoutMS: 5000,
        serverSelectionTimeoutMS: 5000,
      })
      await this._client.connect()
      this._instance = this._client.db(databaseName)
      console.log('Database connection established')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      this._client = null
      this._instance = null
      console.error(errorMsg)
      throw new Error(`MongoDb Connection Failed: ${errorMsg}`)
    }
  }

  public static async getInstance(): Promise<Db> {
    if (!this._instance && !this._client)
      await this.initiateDatabaseConnection()

    if (!this._instance)
      throw new Error(
        'MongoDb Instance not initialized after connection attempt',
      )

    return this._instance
  }

  public static async closeConnection(): Promise<void> {
    if (!this._client) {
      console.log('No MongoDB connection to close')
      return
    }

    try {
      await this._client.close()
      console.log('Database connection closed')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error('Failed to close MongoDB connection', { error: errorMsg })
      throw new Error(`MongoDB close failed: ${errorMsg}`)
    } finally {
      this._client = null
      this._instance = null
    }
  }
}
