import { validationResult } from '@core/common/types.js'
import { ThreadsDto } from '../dto/entityDto.js'
import { ThreadsSchema } from '../rulesEngine/Threads.core.js'
import { validator, validateRequiredFields } from '@core/common/validations.js'
import { execOperations } from '@core/common/utils.js'
import { flatten } from '@core/common/utils.js'
import { MODULE_NAME, RuleSetKeys } from '@core/common/constants.js'

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

  static validate(thread: ThreadsDto): validationResult {
    let message = ''
    const toValidate = flatten(thread)

    message = validateRequiredFields(toValidate, ThreadsSchema.requiredFields)
    if (message) {
      return {
        isValid: false,
        validationErr: message,
      }
    }

    for (const field in toValidate) {
      const value = toValidate[field as keyof ThreadsDto]
      const validations = ThreadsSchema.fields[field]?.validations

      const { isValid, validationErr: validationMsg } = validator(
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
      validationErr: message,
    }
  }

  static validateHierarchy(thread: ThreadsDto): validationResult {
    let message = ''

    if (!ThreadsSchema.ruleSet)
      return {
        isValid: false,
        validationErr: `${MODULE_NAME}: Threads: Validation ruleSet not defined`,
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
      validationErr: message,
    }
  }
}
