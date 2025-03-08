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
      name: 'VALIDATE_HIERARCHY',
      description:
        "'parentThread' and 'rootThread' cannot be null when depth is 1 or 2",
      condition: {
        field: 'depth',
        operator: 'equals',
        args: ['depth', 0],
        expected: false,
        dependencies: [
          {
            field: 'parentThread',
            operator: 'notEqualsTo',
            args: ['parentThread', null],
          },
          {
            field: 'rootThread',
            operator: 'notEqualsTo',
            args: ['rootThread', null],
          },
        ],
      },
    },
    [RuleKeysThreads.MaxChildThreads]: {
      name: 'MAX_CHILD_THREADS',
      description: 'Maximum 2 nested replies per root thread',
      condition: {
        field: 'depth',
        operator: 'lessThanEqualsTo',
        args: ['depth', 3],
        expected: true,
      },
    },
  },
}
