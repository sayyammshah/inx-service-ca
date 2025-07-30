import { ValidationResult } from '../common/resultHandlers.js'
import { validateRequiredFields, validator } from '../common/validations.js'
import { execOperations, flatten } from '../common/utils.js'
import { RuleSetKeys, MODULE_NAME } from '../common/constants.js'
import { EntityRules } from '../common/types.js'

export const InsightsSchema: EntityRules = {
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

export interface IInsightStats {
  likes: number
  dislikes: number
  views: number
  comments: number
}

export type IInsightDto = {
  insightId: string
  authorId: string
  title: string
  content: string
  tags?: string[] | []
  stats?: IInsightStats
  updatedAt?: number | null
  _ts?: number | null
}

export class InsightEntity {
  constructor(public payload: IInsightDto) {
    this.payload._ts = new Date().getTime()
    this.payload.updatedAt = this.payload._ts
  }

  static validate(insight: IInsightDto): ValidationResult {
    let message = ''
    const toValidate = flatten(insight)

    message = validateRequiredFields(toValidate, InsightsSchema.requiredFields)
    if (message) {
      return {
        isValid: false,
        err: message,
      }
    }

    for (const field in toValidate) {
      const value = toValidate[field as keyof IInsightDto]
      const validations = InsightsSchema.fields[field]?.validations

      const { isValid, err } = validator(field, value, validations)

      if (!isValid) {
        message = err
        break
      }
    }

    return {
      isValid: !message,
      err: message,
    }
  }

  /**
   * Insight can be edited only within 1 hour of creation to prevent abuse of historical content.
   *
   * @param insight - The insight object containing the creation timestamp.
   * @returns An object containing a boolean indicating whether the insight can be edited and a message describing the reason if applicable
   */
  static canEdit(insight: IInsightDto): ValidationResult {
    let message = ''

    if (!InsightsSchema.ruleSet)
      return {
        isValid: false,
        err: `${MODULE_NAME}: core rules for insights are undefined`,
      }

    const { initialCase, cases } =
      InsightsSchema.ruleSet[RuleSetKeys.Insights_CanEdit]

    const executeCase = (currentCase: string | null) => {
      if (!currentCase) return

      const { check, action, errorTxt, nextCase } = cases[currentCase]

      const result = execOperations(check, insight)
      if (result && !action) return
      if (result && action) {
        message = execOperations(action, insight) ? '' : errorTxt
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
