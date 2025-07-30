import { Gender } from '../common/constants.js'
import { ValidationResult } from '../common/resultHandlers.js'
import { EntityRules } from '../common/types.js'
import { flatten, generateId } from '../common/utils.js'
import { validateRequiredFields, validator } from '../common/validations.js'

const UserRules: EntityRules = {
  requiredFields: ['name', 'email', 'password'],
  fields: {
    userId: {
      description: "Hex ID that uniquely identifies the user's document",
      validations: {
        type: 'string',
        size: '32-32',
      },
    },
    name: {
      description: "User's full name (firstName + lastName)",
      validations: {
        type: 'string',
        size: '2-50',
        pattern: /^[A-Za-z]+ [A-Za-z]+$/,
      },
    },
    email: {
      description: 'Valid email address',
      validations: {
        type: 'string',
        pattern:
          /^[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
        size: '2-50',
      },
    },
    password: {
      description: 'Secure password (letters, numbers, or special characters)',
      validations: {
        type: 'string',
        pattern:
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        size: '2-16',
      },
    },
    dob: {
      description: 'Date of Birth',
      validations: {
        type: 'number',
      },
    },
    gender: {
      description: 'Gender',
      validations: {
        type: 'string',
        list: Gender,
      },
    },
    profilePicture: {
      description: 'Profile picture (base64 encoded).',
      validations: {
        type: 'string',
      },
    },
  },
}

export interface IUserDto {
  userId: string
  name: string
  email: string
  password: string
  dob?: number | null
  gender?: Gender | null
  profilePicture?: string | null
  _ts: number
}

export class UserEntity {
  constructor(public payload: IUserDto) {
    this.payload.userId = generateId()
    this.payload._ts = Date.now()
  }

  static validate(user: IUserDto, isAuth: boolean = false): ValidationResult {
    let message = ''
    const toValidate = flatten<IUserDto>(user)
    let fieldsRequired = UserRules.requiredFields

    if (isAuth) {
      fieldsRequired = fieldsRequired.filter((field: string) =>
        ['email', 'password'].includes(field),
      )
    }

    message = validateRequiredFields(toValidate, fieldsRequired)
    if (message) {
      return {
        isValid: false,
        err: message,
      }
    }

    for (const field in toValidate) {
      if (isAuth && !['email', 'password'].includes(field)) continue

      const value = toValidate[field]
      const validations = UserRules.fields[field].validations
      const { isValid, err } = validator(field, value, validations)
      if (!isValid) {
        message = err
        break
      }
    }

    return {
      isValid: !message,
      err: message,
    }
  }
}
