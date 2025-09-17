// IPC Handler Layer: History Handler
import { ipcMain } from 'electron'
import { logger } from '../core/logger'
import { requestService } from '../services/requestService'
import { repositories } from '../repositories'

export function registerHistoryHandlers(): void {
  // 获取最近的历史记录
  ipcMain.handle('get-recent-history', async (_, limit: number = 50) => {
    try {
      logger.info(`IPC: Handling get-recent-history with limit ${limit}`)
      const history = repositories.history.findRecent(limit)
      return history
    } catch (error) {
      logger.error('IPC: get-recent-history failed', error)
      throw error
    }
  })

  // 根据请求ID获取历史记录
  ipcMain.handle('get-request-history', async (_, requestId: number) => {
    try {
      logger.info(`IPC: Handling get-request-history for ${requestId}`)
      const history = await requestService.getRequestHistory(requestId)
      return history
    } catch (error) {
      logger.error('IPC: get-request-history failed', error)
      throw error
    }
  })

  // 删除历史记录
  ipcMain.handle('delete-history', async (_, historyId: number) => {
    try {
      logger.info(`IPC: Handling delete-history for ${historyId}`)
      const success = repositories.history.delete(historyId)
      return { success }
    } catch (error) {
      logger.error('IPC: delete-history failed', error)
      throw error
    }
  })

  // 清除所有历史记录
  ipcMain.handle('clear-history', async () => {
    try {
      logger.info('IPC: Handling clear-history')
      const allHistory = repositories.history.findAll()
      let deletedCount = 0
      for (const history of allHistory) {
        if (repositories.history.delete(history.id)) {
          deletedCount++
        }
      }
      return { success: true, deletedCount }
    } catch (error) {
      logger.error('IPC: clear-history failed', error)
      throw error
    }
  })

  logger.info('History IPC handlers registered')
}
