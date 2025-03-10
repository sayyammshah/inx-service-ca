import {
  InsightDataInterface,
  UserDataInterface,
} from '@core/storage-interface'
import { RuleKeys } from './constants.ts'

export type validationResult = {
  isValid: boolean
  message: string
}

export type ChildValidations = Omit<
  RulesType['fields'][string]['validations'],
  'arrLen' | 'children'
>

export type RulesType = {
  fields: {
    [key: string]: {
      description: string
      validations: {
        type:
          | 'string'
          | 'number'
          | 'boolean'
          | 'function'
          | 'object'
          | 'array'
          | 'enum'
        required: boolean
        format: RegExp | string | null
        charLen: string | null // add chararacter length '-' seperated
        arrLen: number | null // applicable only if array
        enumList: Array<unknown> | Record<string, unknown> | null
        children: {
          [key: string]: {
            description: string
            validations: ChildValidations
          }
        } | null
      }
    }
  }
  core?: {
    [key in RuleKeys]: {
      name: string
      description: string
      initialCase: string
      cases: {
        [key: string]: {
          ifCondition: {
            operator: string
            operands: Array<unknown>
          }
          thenCondition: { operator: string; operands: Array<unknown> } | null
          failureMessage: string
          nextCase: string | null
        }
      }
    }
  }
}

export type GenSecretsReturnRes = {
  isValid: boolean
  message: string
  payload: unknown
}

// Adapters
export type UserAdapters = {
  UserDataAdapter: UserDataInterface
}
export type InsightAdapters = {
  InsightDataAdapter: InsightDataInterface
}
export type ThreadAdapters = {
  ThreadDataAdapter: ThreadDataInterface
}

// Shared
export interface CoreRequestContext {
  method: RequestMethods
  requestId: string // Unique identifier for tracking the request within this service
  userAgent: string | undefined // parseIt
  correlationId: string // Used for tracing requests across multiple microservices
}
