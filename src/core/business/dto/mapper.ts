import {
  AppResStatusCodes,
  CoreUserErrorMsg,
  Gender,
} from 'core/common/constants.js'
import { UserDto } from 'core/business/dto/entityDto.js'
import { AppError } from 'shared/apiResponseCls.js'
import { fileURLToPath } from 'node:url'

export const generateUserDto = (payload: unknown): UserDto => {
  if (typeof payload !== 'object' || payload === null)
    throw new AppError(
      AppResStatusCodes.BAD_REQUEST,
      CoreUserErrorMsg.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} ${generateUserDto.name}`,
    )

  const { name, email, password, dob, gender, profilePicture } =
    payload as Record<string, unknown>

  return {
    name: name as string,
    email: email as string,
    password: password as string,
    dob: dob ? (dob as number) : null,
    gender: gender ? (gender as Gender) : null,
    profilePicture: profilePicture as string | null,
  }
}
