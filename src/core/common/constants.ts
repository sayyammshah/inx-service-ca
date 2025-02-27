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
  NOT_FOUND: 404,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
}
