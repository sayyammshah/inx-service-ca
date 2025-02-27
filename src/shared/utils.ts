import { randomUUID } from 'node:crypto'

export const generateUUID = (): string => randomUUID().toString()
