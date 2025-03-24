import { validationResult } from '@core/common/types.js'
import { InsightDto } from '../dto/entityDto.js'
import { validateRequiredFields, validator } from '@core/common/validations.js'
import { execOperations, flatten } from '@core/common/utils.js'
import { InsightsSchema } from '../rulesEngine/Insight.core.js'
import { MODULE_NAME, RuleSetKeys } from '@core/common/constants.js'

type Stats =
  | {
      likes: number
      dislikes: number
      views: number
      comments: number
    }
  | Record<string, number>

export class Insights {
  // Immutable Properties
  readonly insightId: string
  readonly authorId: string
  readonly createdAt: number

  // Mutable Properties
  title: string
  content: string
  stats: Stats
  updatedAt: number
  tags: string[]

  constructor({
    insightId,
    authorId,
    title,
    content,
    tags,
    stats,
  }: {
    insightId: string
    authorId: string
    title: string
    content: string
    tags?: string[] | []
    stats?: Stats | null
  }) {
    this.insightId = insightId
    this.authorId = authorId
    this.title = title
    this.content = content
    this.tags = tags || []
    this.stats = stats ?? {
      likes: 0,
      dislikes: 0,
      views: 0,
      comments: 0,
    }
    this.createdAt = new Date().getTime()
    this.updatedAt = this.createdAt
  }

  static validate(insight: InsightDto): validationResult {
    let message = ''
    const toValidate = flatten(insight)

    message = validateRequiredFields(toValidate, InsightsSchema.requiredFields)
    if (message) {
      return {
        isValid: false,
        validationErr: message,
      }
    }

    for (const field in toValidate) {
      const value = toValidate[field as keyof InsightDto]
      const validations = InsightsSchema.fields[field]?.validations

      const { isValid, validationErr } = validator(field, value, validations)

      if (!isValid) {
        message = validationErr
        break
      }
    }

    return {
      isValid: !message,
      validationErr: message,
    }
  }

  /**
   * Insight can be edited only within 1 hour of creation to prevent abuse of historical content.
   *
   * @param insight - The insight object containing the creation timestamp.
   * @returns An object containing a boolean indicating whether the insight can be edited and a message describing the reason if applicable
   */
  static canEdit(insight: InsightDto): validationResult {
    let message = ''

    if (!InsightsSchema.ruleSet)
      return {
        isValid: false,
        validationErr: `${MODULE_NAME}: core rules for insights are undefined`,
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
      validationErr: message,
    }
  }
}
