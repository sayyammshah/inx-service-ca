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
  // Record<string, number> | null
  createdAt?: number | null
  updatedAt?: number | null
}

export type ThreadsDto = {
  insightId: string
  authorId: string
  content: string
  threadId: string
  depth: 0 | 1 | 2
  path: string
  parentThread?: string | null // null in case of parent thread
  rootThread?: string | null // Top Level Comment
  stats?: Record<string, number> | null
  createdAt?: number
  updatedAt?: number
}
