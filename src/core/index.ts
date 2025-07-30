import { ErrorInst, ResultInst } from './common/resultHandlers.js'
import { StatusCodes } from './common/constants.js'
import type {
  GenSecretsResult,
  IResultInst,
  IErrorInst,
} from './common/types.js'
import { generateId } from './common/utils.js'

export {
  // Core Module Results

  // response Instances
  ErrorInst as CoreErrorInstance,
  ResultInst as CoreResultInstance,

  // Type Definitions
  GenSecretsResult as CoreSecretsResult,
  IResultInst as ICoreResult,
  IErrorInst as ICoreError,

  // Constants
  StatusCodes as CoreStatusCodes,

  // Utils
  generateId,
}

// Entities
export * from './entities/index.js'

// Application - UseCases
export * from './applications/index.js'

// Interfaces
export * from './interfaces/index.js'
