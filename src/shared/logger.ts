import { LoggerOptions, pino } from 'pino'
import { pinoHttp } from 'pino-http'
import { ENVS } from 'shared/constants.js'

const isDevelopment = process.env.NODE_ENV === ENVS.DEV_LOCAL
const isProd = process.env.NODE_ENV === ENVS.PROD
// const isDevelopment = false

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
  isDevelopment
    ? loggerOptions
    : isProd
      ? {
          redact: {
            paths: ['response.data.token'],
            censor: '***',
          },
        }
      : {},
)

const httpLogger = pinoHttp({ logger })

export { logger, httpLogger }
