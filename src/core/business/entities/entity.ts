import { Gender } from '../../common/constants'

export type UserEntity = {
  name: string
  email: string
  password: string
  dob?: number | null
  gender?: Gender | null
  profilePicture?: string | null
}
