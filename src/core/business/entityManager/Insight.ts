import { validationResult } from '@core/common/types.js'
import { InsightDto } from '../dto/entityDto.js'
import { RulesInsight } from '../rulesEngine/Insight.core.js'
import { entityValidator } from '@core/common/validations.js'
import { BusinessRulesMsgs, RuleKeys } from '@core/common/constants.js'
import { convertDate, Operations } from '@core/common/utils.js'

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
  static canEdit(insight: Partial<InsightDto>): {
    canEdit: boolean
    message: string
  } {
    let canEditPost = false

    if (!RulesInsight.core)
      return {
        canEdit: false,
        message: 'Something went wrong',
      }
    const { condition } = RulesInsight.core[RuleKeys.CanAdd]
    const validateCondition = Operations()[condition.operator]
    const updatedArgs = condition.args.map((arg: unknown) => {
      return typeof arg === 'string'
        ? convertDate(insight[arg as keyof InsightDto] as number)
        : arg
    })
    canEditPost = validateCondition(updatedArgs) === condition.expected

    return {
      canEdit: canEditPost,
      message: !canEditPost ? BusinessRulesMsgs.CAN_EDIT : '',
    }
  }

  /**
   * Comments on a insights can only be added after 1 minute after insight has been created to prevent rushed/spammy replies.
   *
   * @param insight - The insight object containing the creation timestamp.
   * @returns An object containing a boolean indicating whether the comment can be added and a message describing the reason if applicable.
   */
  static canAdd(insight: Partial<InsightDto>): {
    canAdd: boolean
    message: string
  } {
    let canAddComment = false

    if (!RulesInsight.core)
      return {
        canAdd: false,
        message: 'Something went wrong',
      }
    const { condition } = RulesInsight.core[RuleKeys.CanAdd]
    const validateCondition = Operations()[condition.operator]
    const updatedArgs = condition.args.map((arg: unknown) => {
      return typeof arg === 'string'
        ? convertDate(insight[arg as keyof InsightDto] as number)
        : arg
    })
    canAddComment = validateCondition(updatedArgs) === condition.expected

    return {
      canAdd: canAddComment,
      message: !canAddComment ? BusinessRulesMsgs.CAN_ADD : '',
    }
  }
}
