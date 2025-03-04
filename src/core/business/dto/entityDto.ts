import { Gender } from 'core/common/constants.js'

export type UserDto = {
  name: string
  email: string
  password: string
  dob?: number | null
  gender?: Gender | null
  profilePicture?: string | null
}

export type InsightDto = {
  insightId: string
  authorId: string
  title: string
  content: string
  tags?: string[] | []
  stats?: Record<string, number> | null
  createdAt?: number | null
  updatedAt?: number | null
}
