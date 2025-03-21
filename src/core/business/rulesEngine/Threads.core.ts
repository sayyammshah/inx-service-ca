import { ID_PATTERN, RuleKeysThreads } from '@core/common/constants.js'
import { RulesType } from '@core/common/types.js'

export const RulesThread: RulesType = {
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
    threadId: {
      description: 'Hex ID that uniquely identifies the thread',
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
    parentThread: {
      description: 'Hex ID that uniquely identifies the parent of thread',
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
    rootThread: {
      description: 'Hex ID that uniquely identifies the root thread',
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
    path: {
      description: 'Path to comment or reply to mesure depth',
      validations: {
        type: 'string',
        required: false,
        format: null,
        charLen: null,
        arrLen: null,
        enumList: null,
        children: null,
      },
    },
    content: {
      description: 'Comment / Reply content',
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
    depth: {
      description:
        'Depth will identify weather the content is comment or reply',
      validations: {
        type: 'string',
        required: true,
        format: null,
        charLen: null,
        arrLen: null,
        enumList: ['0', '1', '2'],
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
        },
      },
    },
  },
  core: {
    [RuleKeysThreads.ValidateHierarchy]: {
      name: 'Hierarchy Validations',
      description: 'Validations for Thread Hierarchy',
      initialCase: 'depthEqualsToZero',
      cases: {
        depthEqualsToZero: {
          ifCondition: {
            operator: 'equalsTo',
            operands: ['depth', 0],
          },
          thenCondition: {
            operator: 'isUndefined',
            operands: ['rootThread', 'parentThread'],
          },
          failureMessage:
            "'parentThread' and 'rootThread' should be null when depth is equals to zero",
          nextCase: 'depthGreaterThanZero',
        },
        depthGreaterThanZero: {
          ifCondition: {
            operator: 'greaterThan',
            operands: ['depth', 0],
          },
          thenCondition: {
            operator: 'isDefined',
            operands: ['parentThread', 'rootThread'],
          },
          failureMessage:
            "'parentThread' and 'rootThread' are mandatory when depth is greater than zero",
          nextCase: null,
        },
      },
    },
  },
}
