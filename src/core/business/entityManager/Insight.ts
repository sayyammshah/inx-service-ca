import { validationResult } from '@core/common/types.js'
import { InsightDto } from '../dto/entityDto.js'
import { RulesInsight } from '../rulesEngine/Insight.core.js'
import { entityValidator } from '@core/common/validations.js'

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
    tags?: string[]
    stats?: Record<string, number>
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
}
