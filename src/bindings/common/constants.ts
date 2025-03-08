// Token Constants
export const TOKEN = {
  ALGORITHM: 'sha256',
  DELIMETER: '.',
}

export enum CommonErrorMsg {
  INVALID_PARAMS = 'Invalid Params',
  INVALID_TOKEN = 'Invalid Token',
  UNAUTHORIZED = 'Unauthorised',
  NO_RECORDS = 'No records found: ',
}

export enum UserErrorMsg {
  INCORRECT_PASSWORD = 'Incorrect password',
  INVALID_PARAMS = CommonErrorMsg.INVALID_PARAMS,
  INVALID_TOKEN = CommonErrorMsg.INVALID_TOKEN,
  FAILED_ACCOUNT_CREATION = 'Failed to create account: ',
  FAILED_ACCOUNT_AUTH = 'Failed to authenticate account: ',
}

export enum InsightErrorMessage {
  INVALID_PARAMS = CommonErrorMsg.INVALID_PARAMS,
  FAILED_TO_CREATE_INSIGHT = 'Failed to create Insight: ',
  NO_RECORDS = CommonErrorMsg.NO_RECORDS,
}

export enum ThreadsErrorMessage {
  INVALID_PARAMS = CommonErrorMsg.INVALID_PARAMS,
  NO_RECORDS = CommonErrorMsg.NO_RECORDS,
  FAILED_TO_CREATE_THREAD = 'Failed to create Thread: ',
}

// Database Helpers
enum CollectionNames {
  USER = 'InxUsers',
  INSIGHTS = 'InxInsights',
  THREADS = 'inxThreads',
}

export const DATABASE_CONSTANTS = {
  COLLECTIONS: CollectionNames,
  PROJECTIONS: {
    USER: {
      _id: 0,
    },
  },
  AGGR: {
    THREADS_LOOKUP: {
      LOCAL_FIELD: 'insightId',
      FOREIGN_FIELD: 'insightId',
      AS: 'threads',
    },
  },
}
