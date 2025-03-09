import { validationResult } from '@core/common/types.js'
import { ThreadsDto } from '../dto/entityDto.js'
import { RulesThread } from '../rulesEngine/Threads.core.js'
import { entityValidator } from '@core/common/validations.js'
import { MODULE_NAME, RuleKeysThreads } from '@core/common/constants.js'
import { Operations } from '@core/common/utils.js'

export class Threads {
  insightId: string
  authorId: string
  content: string
  depth: 0 | 1 | 2
  path: string
  parentThread?: string | null // null in case of parent thread
  threadId?: string
  rootThread?: string | null // Top Level Comment
  stats?: Record<string, number>
  createdAt?: number
  updatedAt?: number

  constructor({
    insightId,
    authorId,
    content,
    depth,
    path,
    parentThread,
    threadId,
    rootThread,
    stats,
  }: ThreadsDto) {
    this.insightId = insightId
    this.authorId = authorId
    this.content = content
    this.depth = depth
    this.path = path
    this.parentThread = parentThread ?? null
    this.threadId = threadId
    this.rootThread = rootThread ?? null
    this.stats = stats ?? { likes: 0, dislikes: 0 }
    this.createdAt = this.updatedAt = new Date().getTime()
  }

  // Helper Functions
  private static _execCondition(
    condition: { operator: string; operands: Array<unknown> },
    thread: ThreadsDto,
  ): boolean {
    let result = false
    const { operator, operands } = condition

    const args = operands.map((operand) =>
      typeof operand === 'string'
        ? thread[operand as keyof ThreadsDto]
        : operand,
    )
    result = Operations()[operator](args)
    return result
  }

  static validate(thread: ThreadsDto): validationResult {
    let message = ''

    for (const field in thread) {
      const value = thread[field as keyof ThreadsDto]
      const validations = RulesThread.fields[field]?.validations

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

  static validateHierarchy(thread: ThreadsDto): validationResult {
    let message = ''

    if (!RulesThread.core)
      return {
        isValid: false,
        message: `${MODULE_NAME}: core rules for threads are undefined`,
      }

    const { initialCase, cases } =
      RulesThread.core[RuleKeysThreads.ValidateHierarchy]

    const executeCase = (currentCase: string | null) => {
      if (!currentCase) return

      const { ifCondition, thenCondition, failureMessage, nextCase } =
        cases[currentCase]

      const result = Threads._execCondition(ifCondition, thread)
      if (result && !thenCondition) return
      if (result && thenCondition) {
        message = Threads._execCondition(thenCondition, thread)
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
