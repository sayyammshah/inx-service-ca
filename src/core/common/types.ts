import { IInsightDataStore } from '../interfaces/insight.interface.js'
import { IThreadDataStore } from '../interfaces/thread.interface.js'
import { IUserDataStore } from '../interfaces/user.interface.js'
import { StatusCodes } from './constants.js'

export type RuleSetChecks = {
  operator: string
  operands: Array<unknown>
  calculate?: {
    field: string
    operation: string
  }
}

export type RuleSetActions = RuleSetChecks | null

export interface EntityRules {
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

export type GenSecretsResult = {
  isValid: boolean
  message: string
  payload: Record<string, unknown>
}

// Adapters
export type UserAdapters = {
  UserDataAdapter: IUserDataStore
}
export type InsightAdapters = {
  InsightDataAdapter: IInsightDataStore
}
export type ThreadAdapters = {
  ThreadDataAdapter: IThreadDataStore
}

// Response Type Definitions
export interface IResultInst {
  status: StatusCodes
  uid: string
  qryRes: unknown | null
  msg: string
}
export interface IErrorInst {
  status: StatusCodes
  isErr: boolean
  ref: string
  msg?: string
}
