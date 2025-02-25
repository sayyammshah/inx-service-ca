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
