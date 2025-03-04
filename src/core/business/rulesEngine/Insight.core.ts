import { ID_PATTERN } from '@core/common/constants.js'
import { RulesType } from '@core/common/types.js'

export const RulesInsight: RulesType = {
  fields: {
    insightId: {
      description: 'Hex ID that uniquely identifies the post',
      validations: {
        type: 'string',
        required: false,
        format: ID_PATTERN.genIdRegex(),
        charLen: '31-31',
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    authorId: {
      description: 'Reference to the `userId` from the Users model.',
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
    title: {
      description: 'Post title',
      validations: {
        type: 'string',
        required: true,
        format: null,
        charLen: '5-100',
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    content: {
      description: 'Post content',
      validations: {
        type: 'string',
        required: true,
        format: null,
        charLen: '5-500',
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    tags: {
      description: 'Tags',
      validations: {
        type: 'array',
        required: false,
        format: null,
        charLen: null,
        arrLen: 5,
        enumList: null,
        children: null,
      },
    },
    stats: {
      description: 'Engagement metrics',
      validations: {
        type: 'object',
        required: true,
        format: null,
        charLen: null,
        arrLen: null,
        enumList: null,
        children: {
          likes: {
            description: 'Number of likes',
            validations: {
              type: 'number',
              required: false,
              format: null,
              charLen: null,
              enumList: null,
            },
          },
          dislikes: {
            description: 'Number of dislikes',
            validations: {
              type: 'number',
              required: false,
              format: null,
              charLen: null,
              enumList: null,
            },
          },
          views: {
            description: 'Number of views',
            validations: {
              type: 'number',
              required: false,
              format: null,
              charLen: null,
              enumList: null,
            },
          },
          comments: {
            description: 'Number of comments',
            validations: {
              type: 'number',
              required: false,
              format: null,
              charLen: null,
              enumList: null,
            },
          },
        },
      },
    },
  },
  core: {
    CanEdit: {
      name: 'CAN_EDIT',
      description:
        'Insight can be edited only within 1 hour of creation to prevent abuse of historical content.',
      condition: {
        field: 'createdAt',
        operator: 'lessThan',
        args: ['createdAt', 60], // createdAt < 60 minutes
        expected: true,
      },
    },
    CanAdd: {
      name: 'CAN_ADD',
      description:
        'Comments on a insights can only be added after 1 minute after insight has been created to prevent rushed/spammy replies.',
      condition: {
        field: 'createdAt',
        operator: 'greaterThan',
        args: ['createdAt', 2], // createdAt > 2 minutes
        expected: true,
      },
    },
  },
}
