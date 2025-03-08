import { ID_PATTERN } from '@core/common/constants.js'
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
}
