import { EntitySchema } from '@core/common/types.js'
import { RuleSetKeys } from '@core/common/constants.js'

export const InsightsSchema: EntitySchema = {
  requiredFields: ['authorId', 'title', 'content'],
  fields: {
    insightId: {
      description: 'Hex ID that uniquely identifies the post',
      validations: {
        type: 'string',
        size: '32-32',
      },
    },
    authorId: {
      description: 'Reference to the `userId` from the Users model.',
      validations: {
        type: 'string',
        size: '32-32',
      },
    },
    title: {
      description: 'Post title',
      validations: {
        type: 'string',
        size: '5-100',
      },
    },
    content: {
      description: 'Post content',
      validations: {
        type: 'string',
        size: '5-500',
      },
    },
    tags: {
      description: 'Tags',
      validations: {
        type: 'array',
        size: '5',
        childType: 'string',
      },
    },
    stats: {
      description: 'Post statistics',
      validations: {
        type: 'object',
        dependents: ['likes', 'dislikes', 'views', 'comments'],
      },
    },
    'stats.likes': {
      description: 'Number of likes',
      validations: {
        type: 'number',
      },
    },
    'stats.dislikes': {
      description: 'Number of dislikes',
      validations: {
        type: 'number',
      },
    },
    'stats.views': {
      description: 'Number of dislikes',
      validations: {
        type: 'number',
      },
    },
    'stats.comments': {
      description: 'Number of comments',
      validations: {
        type: 'number',
      },
    },
  },
  ruleSet: {
    [RuleSetKeys.Insights_CanEdit]: {
      name: 'CAN_EDIT',
      description:
        'Author can only edit insight within one hour of its creation',
      initialCase: 'createdAtIsLessThanOneHour',
      cases: {
        createdAtIsLessThanOneHour: {
          check: {
            operator: 'lessThan',
            operands: ['createdAt', 60], // 60 minutes
            calculate: {
              field: 'createdAt',
              operation: 'convertDateInMinutes',
            },
          },
          action: null,
          errorTxt:
            "Author can only edit insight within one hour of it's creation",
          nextCase: null,
        },
      },
    },
  },
}
