import { LoggerOptions, pino } from 'pino'
import { pinoHttp } from 'pino-http'
import { ENVS } from 'shared/constants.js'

const isDevelopment = process.env.NODE_ENV === ENVS.DEV

const loggerOptions: LoggerOptions = {
  name: 'inx',
  timestamp: true,
  transport: {
    target: 'pino-pretty',
    options: {
      ignore: 'pid',
    },
  },
}

const logger = pino(isDevelopment ? loggerOptions : {})
const httpLogger = pinoHttp({ logger })

export { logger, httpLogger }
