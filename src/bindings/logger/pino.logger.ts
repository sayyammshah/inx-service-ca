import { RequestContext } from '@bindings/common/types.js'
import { AppLoggerInterface } from '@bindings/logger-interface'
import { logger } from 'shared/logger.js'

export class PinoLogger implements AppLoggerInterface {
  options: RequestContext | null = null

  constructor(options: RequestContext) {
    this.options = options
  }
  info(message: string): void {
    logger.info(this.options, message)
  }
  error(message: string): void {
    logger.error(this.options, message)
  }
  debug(message: string): void {
    logger.debug(this.options, message)
  }
  warn(message: string): void {
    logger.warn(this.options, message)
  }
}
