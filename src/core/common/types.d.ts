import {
  InsightDataInterface,
  UserDataInterface,
  ThreadDataInterface,
} from '@core/storage-interface'

export type RuleSetChecks = {
  operator: string
  operands: Array<unknown>
  calculate?: {
    field: string
    operation: string
  }
}
export type RuleSetActions = RuleSetChecks | null

export interface EntitySchema {
  requiredFields: Array<string>
  fields: {
    [key: string]: {
      description: string
      validations: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'enum'
        size?: string | null // represents character length if field is of tupe string and array length if field is of type array
        list?: Array<unknown> | Record<string, unknown> | null
        childType?: string | null // applicable only if type is array or object
        pattern?: RegExp | null
        dependents?: Array<string> // applicable only in case of nested structure
      }
    }
  }
  ruleSet?: {
    [key: string]: {
      name: string
      description: string
      initialCase: string
      cases: {
        [key: string]: {
          check: RuleSetChecks
          action: RuleSetActions
          errorTxt: string
          nextCase: string | null
        }
      }
    }
  }
}

export type validationResult = {
  isValid: boolean
  validationErr: string
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
