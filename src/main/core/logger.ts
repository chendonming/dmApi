// 后端日志系统：集成 electron-log
import log from 'electron-log'

class Logger {
  private logger: typeof log

  constructor() {
    this.logger = log

    // 配置日志
    this.logger.transports.file.level = 'info'
    this.logger.transports.console.level = 'debug'

    // 设置日志文件路径
    this.logger.transports.file.fileName = 'dmApi.log'
    this.logger.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}'

    // 限制日志文件大小
    this.logger.transports.file.maxSize = 10485760 // 10MB
  }

  info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args)
  }

  warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args)
  }

  error(message: string, ...args: unknown[]): void {
    this.logger.error(message, ...args)
  }

  debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args)
  }
}

export const logger = new Logger()
export default logger
