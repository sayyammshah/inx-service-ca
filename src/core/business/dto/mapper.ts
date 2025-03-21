import {
  AppResStatusCodes,
  CoreUserErrorMsg,
  Gender,
} from 'core/common/constants.js'
import { InsightDto, ThreadsDto, UserDto } from 'core/business/dto/entityDto.js'
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

export const generateInsightDto = (payload: unknown): InsightDto => {
  if (typeof payload !== 'object' || payload === null)
    throw new AppError(
      AppResStatusCodes.BAD_REQUEST,
      CoreUserErrorMsg.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} ${generateInsightDto.name}`,
    )

  const { insightId, authorId, title, content, tags, stats } =
    payload as Record<string, unknown>

  return {
    insightId: insightId as string,
    authorId: authorId as string,
    title: title as string,
    content: content as string,
    tags: tags ? (tags as Array<string>) : [],
    stats: stats ? (stats as Record<string, number>) : null,
  }
}

export const generateThreadsDto = (payload: unknown): ThreadsDto => {
  if (typeof payload !== 'object' || payload === null)
    throw new AppError(
      AppResStatusCodes.BAD_REQUEST,
      CoreUserErrorMsg.INVALID_PARAMS,
      `${fileURLToPath(import.meta.url)} ${generateThreadsDto.name}`,
    )

  const {
    insightId,
    authorId,
    content,
    depth,
    path,
    parentThread,
    threadId,
    rootThread,
    stats,
  } = payload as Record<string, unknown>

  return {
    insightId: insightId as string,
    authorId: authorId as string,
    content: content as string,
    depth: depth as 0 | 1 | 2,
    path: path as string,
    threadId: threadId as string,
    parentThread: parentThread ? (parentThread as string) : null,
    rootThread: rootThread ? (rootThread as string) : null,
    stats: stats ? (stats as Record<string, number>) : null,
  }
}
