export const MODULE_NAME = 'M_CORE'
export const ID_PATTERN = {
  genIdRegex: (length: number = 31): RegExp =>
    new RegExp(`^[0-9a-zA-Z]{${length}}$`),
}

export const RULES_CONSTANTS = {
  LENTH_DELIMITER: '-',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

// Errors
export enum ValidationErrors {
  REQUIRED = 'value is required',
  TYPE = 'has invalid type',
  INVALID = 'invalid value provided',
  LENGTH_MIN = 'expected minimum length is',
  LENGTH_MAX = 'expected maximum length is',
  FORMAT = 'has invalid format',
}
export enum CoreUserErrorMsg {
  USER_EXISTS = 'Account already exists.',
  USER_NOT_FOUND = 'User not found',
  INCORRECT_PASSWORD = 'Incorrect password',
  INVALID_PARAMS = 'Invalid params',
}

// Hash Constants
export const HASH = {
  ALGORITHM: 'sha512',
  SALT_LENGTH: 16,
  ITERATIONS: 10000,
  KEY_LENGTH: 16,
  DELIMETER: '.',
}

export const AppResStatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

export const UserAuthFields = ['email', 'password']
