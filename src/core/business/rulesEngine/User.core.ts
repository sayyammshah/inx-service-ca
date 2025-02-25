import { Gender } from '../common/constants.js'
import { RulesType } from '../common/types.js'
import {
  enumValidation,
  formatValidation,
  lengthValidation,
  mandatoryFieldValidation,
  typeValidation,
} from '../common/validations.js'

export const Rules: RulesType = {
  fields: {
    userId: {
      description: "Hex ID that uniquely identifies the user's document",
      validations: {
        type: 'string',
        required: true,
        format: /^[0-9a-fA-F]{16}$/,
        minLen: 16,
        maxLen: 16,
        enumList: null,
      },
    },
    name: {
      description: "User's full name (firstName + lastName)",
      validations: {
        type: 'string',
        required: true,
        format: /^[A-Za-z]+ [A-Za-z]+$/,
        minLen: 2,
        maxLen: 50,
        enumList: null,
      },
    },
    email: {
      description: 'Valid email address',
      validations: {
        type: 'string',
        required: true,
        format:
          /^[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
        minLen: 2,
        maxLen: 50,
        enumList: null,
      },
    },
    password: {
      description: 'Secure password (letters, numbers, or special characters)',
      validations: {
        type: 'string',
        required: true,
        format:
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        minLen: 2,
        maxLen: 50,
        enumList: null,
      },
    },
    dob: {
      description: 'Date of Birth',
      validations: {
        type: 'number',
        required: false,
        format: null,
        minLen: null,
        maxLen: null,
        enumList: null,
      },
    },
    gender: {
      description: 'Gender',
      validations: {
        type: 'string',
        required: false,
        format: 'Gender',
        minLen: null,
        maxLen: null,
        enumList: Gender,
      },
    },
    profilePicture: {
      description: 'Profile picture (base64 encoded).',
      validations: {
        type: 'string',
        required: false,
        format: 'Base64',
        minLen: null,
        maxLen: null,
        enumList: null,
      },
    },
  },
  handlers: {
    getValidations: <T>(key: string, value: T): (() => string)[] => {
      const { required, type, format, minLen, maxLen, enumList } =
        Rules.fields[key].validations
      return [
        () => mandatoryFieldValidation<typeof value>(value, required),
        () => typeValidation<typeof value>(value, type),
        () => lengthValidation(value as string, minLen, maxLen),
        () => formatValidation(value as string, format),
        () => enumValidation<typeof value>(value, enumList),
      ]
    },
  },
}
