import { LoggerOptions, pino } from 'pino'
import { pinoHttp } from 'pino-http'
import { ENVS } from './constants'
import { NextFunction, Request, Response } from 'express'

const ifDevelopment = process.env.NODE_ENV === ENVS.DevLocal
const ifProd = process.env.NODE_ENV === ENVS.Prod
const ifTest = process.env.NODE_ENV === ENVS.Test

const loggerOptions: LoggerOptions = {
  name: 'inx',
  timestamp: true,
  redact: {
    paths: ['response.data.token'],
    censor: '***',
  },
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid,hostname',
    },
  },
}

const logger = pino(
  ifDevelopment
    ? loggerOptions
    : ifProd
      ? {
          redact: {
            paths: ['response.data.token'],
            censor: '***',
          },
        }
      : {},
)

const httpLogger = ifTest
  ? (req: Request, res: Response, next: NextFunction) => next()
  : pinoHttp({ logger })

export { logger, httpLogger }
