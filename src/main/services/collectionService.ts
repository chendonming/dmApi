// 服务层：集合服务
import { logger } from '../core/logger'
import { repositories } from '../repositories'
import { CollectionEntity } from '../core/types'

class CollectionService {
  async createCollection(
    name: string,
    description?: string,
    parentId?: number
  ): Promise<CollectionEntity> {
    logger.info(`Creating collection: ${name}`)

    const collection = repositories.collections.create({
      name,
      description,
      parent_id: parentId
    })

    logger.info(`Collection created with id: ${collection.id}`)
    return collection
  }

  async getCollections(parentId?: number): Promise<CollectionEntity[]> {
    logger.info(`Getting collections${parentId ? ` for parent ${parentId}` : ''}`)

    if (parentId !== undefined) {
      return repositories.collections.findByParent(parentId)
    }

    return repositories.collections.findAll()
  }

  async getCollectionTree(): Promise<CollectionEntity[]> {
    logger.info('Getting collection tree')
    return repositories.collections.findTree()
  }

  async getCollectionById(id: number): Promise<CollectionEntity | null> {
    return repositories.collections.findById(id)
  }

  async updateCollection(
    id: number,
    updates: Partial<CollectionEntity>
  ): Promise<CollectionEntity | null> {
    logger.info(`Updating collection ${id}`)
    return repositories.collections.update(id, updates)
  }

  async deleteCollection(id: number): Promise<boolean> {
    logger.info(`Deleting collection ${id}`)

    // 使用事务删除集合及其所有子集合和请求
    const result = database.transaction(() => {
      // 删除所有子集合
      const childCollections = repositories.collections.findByParent(id)
      for (const child of childCollections) {
        repositories.collections.delete(child.id)
      }

      // 删除集合中的所有请求
      const requests = repositories.requests.findByCollection(id)
      for (const request of requests) {
        repositories.requests.delete(request.id)
      }

      // 删除集合本身
      return repositories.collections.delete(id)
    })

    return result
  }

  async moveCollection(id: number, newParentId?: number): Promise<boolean> {
    logger.info(`Moving collection ${id} to parent ${newParentId || 'root'}`)

    // 防止将集合移动到其子集合下
    if (newParentId) {
      const descendants = await this.getAllDescendants(id)
      if (descendants.some((desc) => desc.id === newParentId)) {
        logger.error('Cannot move collection to its own descendant')
        return false
      }
    }

    const result = database.transaction(() => {
      const updateResult = repositories.collections.update(id, { parent_id: newParentId })
      return updateResult !== null
    })

    return result
  }

  private async getAllDescendants(collectionId: number): Promise<CollectionEntity[]> {
    const descendants: CollectionEntity[] = []
    const children = repositories.collections.findByParent(collectionId)

    for (const child of children) {
      descendants.push(child)
      descendants.push(...(await this.getAllDescendants(child.id)))
    }

    return descendants
  }
}

import { database } from '../core/database'

export const collectionService = new CollectionService()
export default collectionService
