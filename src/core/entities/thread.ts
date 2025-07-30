import { ValidationResult } from '../common/resultHandlers.js'
import { generateId, flatten, execOperations } from '../common/utils.js'
import { EntityRules } from '../common/types.js'
import { MODULE_NAME, RuleSetKeys } from '../common/constants.js'
import { validator, validateRequiredFields } from '../common/validations.js'

export const ThreadsSchema: EntityRules = {
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

export interface IThreadsDto {
  insightId: string
  authorId: string
  content: string
  threadId: string
  depth: 0 | 1 | 2
  path: string
  parentThread?: string | null // null in case of parent thread
  rootThread?: string | null // Top Level Comment
  stats?: Record<string, number> | null
  updatedAt?: number
  _ts?: number
}

export class ThreadEntity {
  constructor(public payload: IThreadsDto) {
    this.payload.threadId = generateId()
    this.payload._ts = this.payload.updatedAt = new Date().getTime()
  }

  static validate(thread: IThreadsDto): ValidationResult {
    let message = ''
    const toValidate = flatten(thread)

    message = validateRequiredFields(toValidate, ThreadsSchema.requiredFields)
    if (message) {
      return {
        isValid: false,
        err: message,
      }
    }

    for (const field in toValidate) {
      const value = toValidate[field as keyof IThreadsDto]
      const validations = ThreadsSchema.fields[field]?.validations

      const { isValid, err: validationMsg } = validator(
        field,
        value,
        validations,
      )
      if (!isValid) {
        message = validationMsg
        break
      }
    }

    return {
      isValid: !message,
      err: message,
    }
  }

  static validateHierarchy(thread: IThreadsDto): ValidationResult {
    let message = ''

    if (!ThreadsSchema.ruleSet)
      return {
        isValid: false,
        err: `${MODULE_NAME}: Threads: Validation ruleSet not defined`,
      }

    const { initialCase, cases } =
      ThreadsSchema.ruleSet[RuleSetKeys.Threads_HierarchyValidation]

    const executeCase = (currentCase: string | null) => {
      if (!currentCase) return

      const { check, action, errorTxt, nextCase } = cases[currentCase]

      const result = execOperations(check, thread)
      if (result && !action) return
      if (result && action) {
        message = execOperations(action, thread) ? '' : errorTxt
        return
      }
      if (nextCase) return executeCase(nextCase)
      message = errorTxt
      return
    }
    executeCase(initialCase)

    return {
      isValid: !message,
      err: message,
    }
  }
}
