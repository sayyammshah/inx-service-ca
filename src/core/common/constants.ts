export const MODULE_NAME = 'M_CORE'
export const ID_PATTERN = {
  genIdRegex: (length: number = 31): RegExp =>
    new RegExp(`^[0-9a-zA-Z]{${length}}$`),
}

export const TIME_CONVERSIONS = {
  // SECONDS: 1000,
  // HOURS: 1000 * 60 * 60,
  MINUTES: 1000 * 60,
  // DAYS: 1000 * 60 * 60 * 24,
  // WEEKS: 1000 * 60 * 60 * 24 * 7,
  // MONTHS: 1000 * 60 * 60 * 24 * 7 * 4,
}

export const RULES_CONSTANTS = {
  LENTH_DELIMITER: '-',
}

export const BR_CONSTANTS = {
  CAN_EDIT_TIME_WINDOW: 60, // 60 Minutes
  CAN_ADD_TIME_WINDOW: 1, // 1 Minutes
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

// Messages
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
  NO_RECORDS = 'No records found',
}
export enum BusinessRulesMsgs {
  CAN_EDIT = "You can edit an insight only within 1 hour after it's created.",
  CAN_ADD = 'You can add comments 1 minute after the insight has been created.',
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

export enum RuleKeys {
  CanEdit = 'CAN_EDIT',
  CanAdd = 'CAN_ADD',
}
