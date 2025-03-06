export enum COLLECTION_NAMES {
  USER = 'InxUsers',
  INSIGHTS = 'InxInsights',
}

// Token Constants
export const TOKEN = {
  ALGORITHM: 'sha256',
  DELIMETER: '.',
}

// Database Projections
export const USER_PROJECTIONS = {
  _id: 0,
}

export enum CommonErrorMsg {
  INVALID_PARAMS = 'Invalid Params',
  INVALID_TOKEN = 'Invalid Token',
  UNAUTHORIZED = 'Unauthorised',
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
  NO_RECORDS = 'No records found: ',
}
