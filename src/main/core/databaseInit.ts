// 数据库初始化脚本
import { repositories } from '../repositories'
import { logger } from './logger'

export async function initializeDefaultData(): Promise<void> {
  try {
    // 检查是否已有默认集合
    const collections = repositories.collections.findAll()
    if (collections.length === 0) {
      logger.info('Creating default collection')

      // 创建默认集合
      repositories.collections.create({
        name: '默认集合',
        description: '系统自动创建的默认请求集合'
      })

      logger.info('Default collection created')
    }

    // 检查是否已有默认环境
    const environments = repositories.environments.findAll()
    if (environments.length === 0) {
      logger.info('Creating default environment')

      // 创建默认环境
      repositories.environments.create({
        name: '默认环境',
        variables: JSON.stringify({
          baseUrl: 'http://localhost:3000'
        })
      })

      logger.info('Default environment created')
    }
  } catch (error) {
    logger.error('Failed to initialize default data:', error)
    throw error
  }
}
