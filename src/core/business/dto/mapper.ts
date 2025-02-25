import { Gender } from 'core/business/common/constants.js'
import { UserDto } from 'core/business/dto/dto.js'

export const generateUserDto = (payload: unknown): UserDto => {
  if (typeof payload !== 'object' || payload === null)
    throw new Error('Invalid payload')

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
