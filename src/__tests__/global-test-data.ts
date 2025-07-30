export const TEST_ENVIRONMENT_VARIABLES = {
  DB_CONNECTION_URL: 'mocked-database-connection-string',
  DB_NAME: 'mocked-database-name',
}

export const MONGO_CLIENT_OPTIONS = {
  maxIdleTimeMS: 5000,
  maxPoolSize: 100,
  connectTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
}
