import { AppResStatusCodes } from '@core/common/constants.ts'
import { UserDataInterface } from '@core/storage-interface'

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
        enumList: Record<string, unknown> | null
        children: {
          [key: string]: {
            description: string
            validations: ChildValidations
          }
        } | null
      }
    }
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
