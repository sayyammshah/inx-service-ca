import { validationResult } from '@core/common/types.js'
import { InsightDto } from '../dto/entityDto.js'
import { RulesInsight } from '../rulesEngine/Insight.core.js'
import { entityValidator } from '@core/common/validations.js'
import { MODULE_NAME, RuleKeysInsights } from '@core/common/constants.js'
import { Calculate, Operations } from '@core/common/utils.js'

export class Insights {
  // Immutable Properties
  readonly insightId: string
  readonly authorId: string
  readonly createdAt: number

  // Mutable Properties
  title: string
  content: string
  stats:
    | {
        likes: number
        dislikes: number
        views: number
        comments: number
      }
    | Record<string, number>
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
    stats?: Record<string, number> | null
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
    this.createdAt = this.updatedAt = new Date().getTime()
  }

  // Helper Functions
  private static _execCondition(
    condition: {
      operator: string
      operands: Array<unknown>
    },
    insight: InsightDto,
  ): boolean {
    let result = false
    const { operator, operands } = condition
    const args = operands.map((operand) => {
      let value =
        typeof operand === 'string'
          ? insight[operand as keyof InsightDto]
          : operand

      if (operand === 'createdAt')
        value = Calculate()['convertDateInMinutes']([value as number])

      return value
    })
    result = Operations()[operator](args)
    return result
  }

  static validate(insight: InsightDto): validationResult {
    let message = ''

    for (const field in insight) {
      const value = insight[field as keyof InsightDto]
      const validations = RulesInsight.fields[field]?.validations

      const { isValid, message: validationMsg } = entityValidator(
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
      message: message,
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

    if (!RulesInsight.core)
      return {
        isValid: false,
        message: `${MODULE_NAME}: core rules for insights are undefined`,
      }

    const { initialCase, cases } = RulesInsight.core[RuleKeysInsights.CanEdit]

    const executeCase = (currentCase: string | null) => {
      if (!currentCase) return

      const { ifCondition, thenCondition, failureMessage, nextCase } =
        cases[currentCase]

      const result = Insights._execCondition(ifCondition, insight)
      if (result && !thenCondition) return
      if (result && thenCondition) {
        message = Insights._execCondition(thenCondition, insight)
          ? ''
          : failureMessage
        return
      }
      if (nextCase) return executeCase(nextCase)
      message = failureMessage
      return
    }
    executeCase(initialCase)

    return {
      isValid: !message,
      message: message,
    }
  }
}
