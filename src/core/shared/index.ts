import type { UserEntity } from '../business/entities/entity'
import { ErrorInst, ResultInst } from '../common/resultHandlers'
import { genUserDto } from './utils'
import type {
  GenSecretsResult,
  IResultInst,
  IErrorInst,
} from '../common/types.d'
import { StatusCodes } from '../common/constants'

export {
  // DTOs
  UserEntity as UserDto,

  // DTO Generators
  genUserDto as generateUserDto,

  // Core Module Results

  // Type Definitions
  GenSecretsResult as CoreSecretsResult,
  ErrorInst as CoreErrorInstance,
  ResultInst as CoreResultInstance,
  IResultInst as ICoreResult,
  IErrorInst as ICoreError,

  // Constants
  StatusCodes as CoreStatusCodes,
}
