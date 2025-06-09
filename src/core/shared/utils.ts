import { fileURLToPath } from 'node:url'
import { UserDto } from './index'
import { Gender } from '../common/constants'
import { ErrorInst } from '../common/resultHandlers'

export const genUserDto = (payload: Record<string, unknown>): UserDto => {
  if (typeof payload !== 'object' || !payload)
    throw new ErrorInst(fileURLToPath(__filename))

  const { name, email, password, dob, gender, profilePicture } = payload

  return {
    name: name as string,
    email: email as string,
    password: password as string,
    dob: dob ? (dob as number) : null,
    gender: gender ? (gender as Gender) : null,
    profilePicture: profilePicture ? (profilePicture as string) : null,
  }
}
