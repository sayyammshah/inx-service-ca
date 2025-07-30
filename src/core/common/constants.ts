export const MODULE_NAME = 'CORE_MODULE'

export const TIME_CONVERSIONS = {
  // SECONDS: 1000,
  // HOURS: 1000 * 60 * 60,
  MINUTES: 1000 * 60,
  // DAYS: 1000 * 60 * 60 * 24,
  // WEEKS: 1000 * 60 * 60 * 24 * 7,
  // MONTHS: 1000 * 60 * 60 * 24 * 7 * 4,
}

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Others = 'Other',
}

export enum ValidationErrors {
  REQUIRED = 'value is required',
  TYPE = 'has invalid type',
  INVALID = 'invalid value provided',
  LENGTH_MIN = 'expected minimum length is',
  LENGTH_MAX = 'expected maximum length is',
  FORMAT = 'has invalid format',
  LENGTH = 'expected length is',
}

export enum StatusCodes {
  Ok = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  Conflict = 409,
  InternalServerError = 500,
}

export enum UserErrMsg {
  UserExists = 'Account already exists.',
  UserNotFound = 'User not found',
  IncorrectPassword = 'Incorrect password',
  InvalidParams = 'Invalid params',
  NoRecords = 'No records found',
}

export const HASH = {
  ALGORITHM: 'sha512',
  SALT_LENGTH: 16,
  ITERATIONS: 10000,
  KEY_LENGTH: 16,
  DELIMETER: '.',
}

export const RuleSetKeys = {
  Insights_CanEdit: 'CAN_EDIT',
  Threads_HierarchyValidation: 'VALIDATE_HIERARCHY',
}
