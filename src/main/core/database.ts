// 数据库模块占位
import { logger } from './logger'

class Database {
  constructor() {
    logger.info('Database module initialized (placeholder)')
  }

  async init(): Promise<void> {
    // TODO: 初始化 SQLite 数据库
    logger.info('Database init placeholder')
    throw new Error('Database not implemented yet')
  }

  async query(sql: string, params?: any[]): Promise<any[]> {
    // TODO: 执行查询
    logger.info(`Database query placeholder: ${sql}`)
    throw new Error('Database query not implemented yet')
  }

  async close(): Promise<void> {
    // TODO: 关闭数据库连接
    logger.info('Database close placeholder')
  }
}

export const database = new Database()
export default database
