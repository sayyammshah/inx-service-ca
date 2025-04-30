import { EntitySchema } from '@core/common/types.js'
import { RuleSetKeys } from '@core/common/constants.js'

export const ThreadsSchema: EntitySchema = {
  requiredFields: ['insightId', 'authorId', 'content', 'depth'],
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
    threadId: {
      description: 'Hex ID that uniquely identifies the thread',
      validations: {
        type: 'string',
        size: '32-32',
      },
    },
    parentThread: {
      description: 'Hex ID that uniquely identifies the parent of thread',
      validations: {
        type: 'string',
        size: '32-32',
      },
    },
    rootThread: {
      description: 'Hex ID that uniquely identifies the root thread',
      validations: {
        type: 'string',
        size: '32-32',
      },
    },
    path: {
      description: 'Path to comment or reply to mesure depth',
      validations: {
        type: 'string',
      },
    },
    content: {
      description: 'Comment / Reply content',
      validations: {
        type: 'string',
        size: '5-500',
      },
    },
    depth: {
      description:
        'Depth will identify weather the content is comment or reply',
      validations: {
        type: 'string',
        list: ['0', '1', '2'],
      },
    },
    stats: {
      description: 'Engagement metrics',
      validations: {
        type: 'object',
        dependents: ['likes', 'dislikes'],
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
  },
  ruleSet: {
    [RuleSetKeys.Threads_HierarchyValidation]: {
      name: 'Hierarchy Validations',
      description: 'Validations for Thread Hierarchy',
      initialCase: 'depthEqualsToZero',
      cases: {
        depthEqualsToZero: {
          check: {
            operator: 'equalsTo',
            operands: ['depth', 0],
          },
          action: {
            operator: 'isUndefined',
            operands: ['rootThread', 'parentThread'],
          },
          errorTxt:
            "'parentThread' and 'rootThread' should be null when depth is equals to zero",
          nextCase: 'depthGreaterThanZero',
        },
        depthGreaterThanZero: {
          check: {
            operator: 'greaterThan',
            operands: ['depth', 0],
          },
          action: {
            operator: 'isDefined',
            operands: ['parentThread', 'rootThread'],
          },
          errorTxt:
            "'parentThread' and 'rootThread' are required when depth is greater than zero",
          nextCase: null,
        },
      },
    },
  },
}
