import { Gender } from 'core/common/constants.js'

export type UserDto = {
  name: string
  email: string
  password: string
  dob?: number | null
  gender?: Gender | null
  profilePicture?: string | null
}
