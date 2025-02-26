export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

// Errors
export enum ValidationErrors {
  REQUIRED = 'Value is required',
  TYPE = 'Has invalid type',
  INVALID = 'Invalid value provided',
  LENGTH_MIN = 'Expected minimum length is',
  LENGTH_MAX = 'Expected maximum length is',
  FORMAT = 'Has invalid format',
}

// Token Constants
export const TOKEN = {
  ALGORITHM: 'sha256',
  DELIMETER: '.',
}

// Hash Constants
export const HASH = {
  ALGORITHM: 'sha512',
  SALT_LENGTH: 128,
  ITERATIONS: 10000,
  KEY_LENGTH: 128,
  DELIMETER: '.',
}

export enum AppResponseStatus {
  SUCCESS = 'success',
  BAD_REQUEST = 'badRequest',
  ERROR = 'error',
}
