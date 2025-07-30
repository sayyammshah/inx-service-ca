import { MongoClient } from 'mongodb'
import { MongoDBClient } from '../../clients/index.js'
import { TEST_ENVIRONMENT_VARIABLES } from '../../../__tests__/global-test-data.js'

jest.mock('mongodb')

beforeEach(() => {
  process.env = {
    ...TEST_ENVIRONMENT_VARIABLES,
  }
  ;(MongoClient as unknown as jest.Mock).mockImplementation(() => ({
    connect: jest.fn(),
    db: jest.fn().mockImplementation((dbName?: string | undefined) => ({
      collection: jest.fn(),
    })),
  }))
})

describe('MongoDbClient', () => {
  describe('initiateDatabaseConnection', () => {})

  it('should have only singleton instance', async () => {
    await MongoDBClient.initiateDatabaseConnection()

    const inst1 = await MongoDBClient.getInstance()
    const inst2 = await MongoDBClient.getInstance()

    expect(inst1).toBe(inst2)
  })

  it('should throw error when no credentials are found', async () => {
    process.env = {}
    await expect(MongoDBClient.initiateDatabaseConnection()).rejects.toThrow(
      `Database credentials not found`,
    )
  })

  it('should throw error if MongoClient.connect fails', async () => {
    const error = 'Connection failed'

    ;(MongoClient as unknown as jest.Mock).mockImplementation(() => ({
      connect: jest.fn().mockRejectedValue(error),
    }))

    await expect(MongoDBClient.initiateDatabaseConnection()).rejects.toThrow(
      `MongoDb Connection Failed: ${error}`,
    )
  })
})
