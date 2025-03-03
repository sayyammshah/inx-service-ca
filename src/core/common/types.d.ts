import { AppResStatusCodes } from '@core/common/constants.ts'
import { UserDataInterface } from '@core/storage-interface'

export type validationResult = {
  isValid: boolean
  message: string
}

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
        minLen: number | null
        maxLen: number | null
        enumList: Record<string, unknown> | null
        children?:
          | {
              [key: string]: {
                description: string
                validations: RulesType['fields'][string]['validations']
              }
            }
          | {
              description: string
              validations: {
                childLen?: number | null
              } & RulesType['fields'][string]['validations']
            }
      }
      // validationHandlers?: unknown
    }
  }
  handlers?: {
    getValidations: <T>(
      key: string,
      value: T,
      isAuth?: boolean,
    ) => (() => string)[]
    excValidations?: (<T>(key: string, value: T) => string)[]
  }
}

export type GenSecretsReturnRes = {
  isValid: boolean
  message: string
  payload: unknown
}

export type UserAdapters = {
  UserDataAdapter: UserDataInterface
}

// Shared
export interface CoreAppResponse {
  status: AppResStatusCodes
  uid: string
  queryResponse: unknown | null
  message: string
}
export interface CoreRequestContext {
  method: RequestMethods
  requestId: string // Unique identifier for tracking the request within this service
  userAgent: string | undefined // parseIt
  correlationId: string // Used for tracing requests across multiple microservices
}
