// IPC Handler Layer：请求处理器
import { ipcMain } from 'electron'
import { logger } from '../core/logger'
import { requestService } from '../services/requestService'
import { RequestData } from '../core/interfaces'

export function registerRequestHandlers(): void {
  // 发送 HTTP 请求
  ipcMain.handle('send-request', async (_, requestData: RequestData) => {
    try {
      logger.info('IPC: Handling send-request')
      return await requestService.sendRequest(requestData)
    } catch (error) {
      logger.error('IPC: send-request failed', error)
      throw error
    }
  })

  // 保存请求
  ipcMain.handle('save-request', async (_, requestData: RequestData, collectionId: number = 1) => {
    try {
      logger.info('IPC: Handling save-request')
      const result = await requestService.saveRequest(requestData, collectionId)
      return { success: true, data: result }
    } catch (error) {
      logger.error('IPC: save-request failed', error)
      throw error
    }
  })

  // 获取请求列表
  ipcMain.handle('get-requests', async () => {
    try {
      logger.info('IPC: Handling get-requests')
      return await requestService.getRequests()
    } catch (error) {
      logger.error('IPC: get-requests failed', error)
      throw error
    }
  })

  logger.info('Request IPC handlers registered')
}
