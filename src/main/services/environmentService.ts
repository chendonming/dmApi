// 服务层：环境服务
import { logger } from '../core/logger'
import { repositories } from '../repositories'
import { EnvironmentEntity } from '../core/types'

class EnvironmentService {
  async createEnvironment(
    name: string,
    variables: Record<string, string>
  ): Promise<EnvironmentEntity> {
    logger.info(`Creating environment: ${name}`)

    const environment = repositories.environments.create({
      name,
      variables: JSON.stringify(variables)
    })

    logger.info(`Environment created with id: ${environment.id}`)
    return environment
  }

  async getEnvironments(): Promise<EnvironmentEntity[]> {
    return repositories.environments.findAll()
  }

  async getEnvironmentById(id: number): Promise<EnvironmentEntity | null> {
    return repositories.environments.findById(id)
  }

  async getActiveEnvironment(): Promise<EnvironmentEntity | null> {
    return repositories.environments.findActive()
  }

  async setActiveEnvironment(id: number): Promise<boolean> {
    logger.info(`Setting active environment to ${id}`)

    const result = database.transaction(() => {
      return repositories.environments.setActive(id)
    })

    return result
  }

  async updateEnvironment(
    id: number,
    updates: Partial<EnvironmentEntity>
  ): Promise<EnvironmentEntity | null> {
    logger.info(`Updating environment ${id}`)

    // 如果更新了变量，需要序列化
    if (updates.variables && typeof updates.variables === 'object') {
      updates.variables = JSON.stringify(updates.variables)
    }

    return repositories.environments.update(id, updates)
  }

  async deleteEnvironment(id: number): Promise<boolean> {
    logger.info(`Deleting environment ${id}`)

    // 检查是否是活跃环境
    const activeEnv = await this.getActiveEnvironment()
    if (activeEnv && activeEnv.id === id) {
      // 如果删除的是活跃环境，需要清除活跃状态
      const result = database.transaction(() => {
        repositories.environments.setActive(-1) // 设置无效ID清除活跃状态
        return repositories.environments.delete(id)
      })
      return result
    }

    return repositories.environments.delete(id)
  }

  async getParsedVariables(id: number): Promise<Record<string, string> | null> {
    const environment = await this.getEnvironmentById(id)
    if (!environment) return null

    try {
      return JSON.parse(environment.variables)
    } catch (error) {
      logger.error(`Failed to parse environment variables for ${id}:`, error)
      return {}
    }
  }

  async getActiveParsedVariables(): Promise<Record<string, string> | null> {
    const activeEnv = await this.getActiveEnvironment()
    if (!activeEnv) return null

    return this.getParsedVariables(activeEnv.id)
  }
}

import { database } from '../core/database'

export const environmentService = new EnvironmentService()
export default environmentService
