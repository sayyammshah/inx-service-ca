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

enum CommonErrorMsg {
  INVALID_PARAMS = 'Invalid Params',
  INVALID_TOKEN = 'Invalid Token',
}

export enum UserErrorMsg {
  INCORRECT_PASSWORD = 'Incorrect password',
  INVALID_PARAMS = CommonErrorMsg.INVALID_PARAMS,
  INVALID_TOKEN = CommonErrorMsg.INVALID_TOKEN,
  FAILED_ACCOUNT_CREATION = 'Failed to create account: ',
  FAILED_ACCOUNT_AUTH = 'Failed to authenticate account: ',
}
