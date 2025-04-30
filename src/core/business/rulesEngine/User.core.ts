import { Gender } from '@core/common/constants.js'
import { EntitySchema } from '@core/common/types.js'

export const UserSchema: EntitySchema = {
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
