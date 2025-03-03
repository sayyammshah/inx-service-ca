import { ID_PATTERN } from '@core/common/constants.js'
import { RulesType } from '@core/common/types.js'
import {
  enumValidation,
  formatValidation,
  lengthValidation,
  mandatoryFieldValidation,
  typeValidation,
} from 'core/common/validations.js'

export const RulesInsight: RulesType = {
  fields: {
    insightId: {
      description: 'Hex ID that uniquely identifies the post',
      validations: {
        type: 'string',
        required: true,
        format: ID_PATTERN.genIdRegex(),
        minLen: 31,
        maxLen: 31,
        enumList: null,
      },
    },
    authorId: {
      description: 'Reference to the `userId` from the Users model.',
      validations: {
        type: 'string',
        required: true,
        format: ID_PATTERN.genIdRegex(),
        minLen: 31,
        maxLen: 31,
        enumList: null,
      },
    },
    title: {
      description: 'Post title.',
      validations: {
        type: 'string',
        required: true,
        format: null,
        minLen: 5,
        maxLen: 100,
        enumList: null,
      },
    },
    content: {
      description: 'Post content.',
      validations: {
        type: 'string',
        required: true,
        format: null,
        minLen: 5,
        maxLen: 500,
        enumList: null,
      },
    },
    tags: {
      description: 'Tags (max 5 tags, 15 chars each).',
      validations: {
        type: 'array',
        required: false,
        format: null,
        minLen: null,
        maxLen: null,
        enumList: null,
        children: {
          description: 'max 5 tags, 15 chars each',
          validations: {
            type: 'string',
            required: false,
            format: null,
            minLen: 3,
            maxLen: null,
            enumList: null,
            childLen: 5,
          },
        },
      },
    },
    stats: {
      description:
        'Engagement metrics (`likes`, `dislikes`, `views`, `comments`).',
      validations: {
        type: 'object',
        required: true,
        format: null,
        minLen: null,
        maxLen: null,
        enumList: null,
        children: {
          likes: {
            description: 'Number of likes.',
            validations: {
              type: 'number',
              required: false,
              format: null,
              minLen: null,
              maxLen: null,
              enumList: null,
            },
          },
          dislikes: {
            description: 'Number of dislikes.',
            validations: {
              type: 'number',
              required: false,
              format: null,
              minLen: null,
              maxLen: null,
              enumList: null,
            },
          },
          views: {
            description: 'Number of views.',
            validations: {
              type: 'number',
              required: false,
              format: null,
              minLen: null,
              maxLen: null,
              enumList: null,
            },
          },
          comments: {
            description: 'Number of comments.',
            validations: {
              type: 'number',
              required: false,
              format: null,
              minLen: null,
              maxLen: null,
              enumList: null,
            },
          },
        },
      },
    },
  },
  handlers: {
    getValidations: <T>(key: string, value: T): (() => string)[] => {
      const { required, type, format, minLen, maxLen, enumList } =
        RulesInsight.fields[key].validations
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
