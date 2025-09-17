// IPC Handler Layer: Collection Handler
import { ipcMain } from 'electron'
import { logger } from '../core/logger'
import { collectionService } from '../services/collectionService'
import { CollectionEntity } from '../core/types'

export function registerCollectionHandlers(): void {
  // 创建集合
  ipcMain.handle(
    'create-collection',
    async (_, name: string, description?: string, parentId?: number) => {
      try {
        logger.info('IPC: Handling create-collection')
        const collection = await collectionService.createCollection(name, description, parentId)
        return { success: true, data: collection }
      } catch (error) {
        logger.error('IPC: create-collection failed', error)
        throw error
      }
    }
  )

  // 获取集合列表
  ipcMain.handle('get-collections', async (_, parentId?: number) => {
    try {
      logger.info('IPC: Handling get-collections')
      const collections = await collectionService.getCollections(parentId)
      return collections
    } catch (error) {
      logger.error('IPC: get-collections failed', error)
      throw error
    }
  })

  // 获取集合树结构
  ipcMain.handle('get-collection-tree', async () => {
    try {
      logger.info('IPC: Handling get-collection-tree')
      const tree = await collectionService.getCollectionTree()
      return tree
    } catch (error) {
      logger.error('IPC: get-collection-tree failed', error)
      throw error
    }
  })

  // 根据ID获取集合
  ipcMain.handle('get-collection-by-id', async (_, id: number) => {
    try {
      logger.info(`IPC: Handling get-collection-by-id for ${id}`)
      const collection = await collectionService.getCollectionById(id)
      return collection
    } catch (error) {
      logger.error('IPC: get-collection-by-id failed', error)
      throw error
    }
  })

  // 更新集合
  ipcMain.handle('update-collection', async (_, id: number, updates: Partial<CollectionEntity>) => {
    try {
      logger.info(`IPC: Handling update-collection for ${id}`)
      const collection = await collectionService.updateCollection(id, updates)
      return { success: collection !== null, data: collection }
    } catch (error) {
      logger.error('IPC: update-collection failed', error)
      throw error
    }
  })

  // 删除集合
  ipcMain.handle('delete-collection', async (_, id: number) => {
    try {
      logger.info(`IPC: Handling delete-collection for ${id}`)
      const success = await collectionService.deleteCollection(id)
      return { success }
    } catch (error) {
      logger.error('IPC: delete-collection failed', error)
      throw error
    }
  })

  // 移动集合
  ipcMain.handle('move-collection', async (_, id: number, newParentId?: number) => {
    try {
      logger.info(`IPC: Handling move-collection for ${id}`)
      const success = await collectionService.moveCollection(id, newParentId)
      return { success }
    } catch (error) {
      logger.error('IPC: move-collection failed', error)
      throw error
    }
  })

  logger.info('Collection IPC handlers registered')
}
