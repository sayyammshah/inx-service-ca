import { Gender, ID_PATTERN } from '@core/common/constants.js'
import { RulesType } from '@core/common/types.js'

export const Rules: RulesType = {
  fields: {
    userId: {
      //  Not considered for validation
      description: "Hex ID that uniquely identifies the user's document",
      validations: {
        type: 'string',
        required: true,
        format: ID_PATTERN.genIdRegex(),
        charLen: '31-31',
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    name: {
      description: "User's full name (firstName + lastName)",
      validations: {
        type: 'string',
        required: true,
        format: /^[A-Za-z]+ [A-Za-z]+$/,
        charLen: '2-50',
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    email: {
      description: 'Valid email address',
      validations: {
        type: 'string',
        required: true,
        format:
          /^[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*@[a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/,
        charLen: '2-50',
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    password: {
      description: 'Secure password (letters, numbers, or special characters)',
      validations: {
        type: 'string',
        required: true,
        format:
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/,
        charLen: '2-16',
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    dob: {
      description: 'Date of Birth',
      validations: {
        type: 'number',
        required: false,
        format: null,
        charLen: null,
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    gender: {
      description: 'Gender',
      validations: {
        type: 'string',
        required: false,
        format: 'Gender',
        charLen: null,
        arrLen: null,
        enumList: Gender,
        children: null,
      },
    },
    profilePicture: {
      description: 'Profile picture (base64 encoded).',
      validations: {
        type: 'string',
        required: false,
        format: 'Base64',
        charLen: null,
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
  },
}
