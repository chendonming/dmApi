// 服务层：请求服务
import { logger } from '../core/logger'
import { requestManager } from '../core/requestManager'
import { RequestData, AppResponse } from '../core/interfaces'
import { database } from '../core/database'
import { repositories } from '../repositories'
import { RequestEntity, HistoryEntity } from '../core/types'

class RequestService {
  async sendRequest(requestData: RequestData): Promise<AppResponse> {
    logger.info(`Sending request: ${requestData.method} ${requestData.url}`)

    const startTime = Date.now()

    try {
      // 调用 RequestManager 发送请求
      const response = await requestManager.sendRequest(requestData)

      const responseTime = Date.now() - startTime
      logger.info(`Request completed with status: ${response.status} in ${responseTime}ms`)

      // 使用事务保存请求历史
      this.saveRequestHistory(requestData, response, responseTime)

      return response
    } catch (error) {
      logger.error('Request failed:', error)
      throw error
    }
  }

  private saveRequestHistory(
    requestData: RequestData,
    response: AppResponse,
    responseTime: number
  ): void {
    // 使用事务确保数据一致性
    const result = database.transaction(() => {
      // 查找或创建请求记录
      let requestEntity = this.findRequestByUrlAndMethod(requestData.url, requestData.method as any)

      if (!requestEntity) {
        // 如果是临时请求，先保存到默认集合中
        requestEntity = repositories.requests.create({
          name: `${requestData.method} ${requestData.url}`,
          url: requestData.url,
          method: requestData.method as any,
          headers: requestData.headers ? JSON.stringify(requestData.headers) : undefined,
          body: requestData.body
        } as any)
      }

      // 保存请求历史
      const historyId = repositories.history.create({
        request_id: requestEntity.id,
        response_status: response.status,
        response_headers: response.headers ? JSON.stringify(response.headers) : undefined,
        response_body: response.rawBody,
        response_time: responseTime,
        executed_at: new Date().toISOString()
      } as any)

      return historyId
    })

    logger.info(`Request history saved with result: ${result}`)
  }

  private findRequestByUrlAndMethod(url: string, method: string): RequestEntity | null {
    // 这是一个简化的实现，实际应该在 Repository 中实现
    const allRequests = repositories.requests.findAll()
    return allRequests.find((req) => req.url === url && req.method === method) || null
  }

  async saveRequest(requestData: RequestData, _collectionId: number): Promise<RequestEntity> {
    logger.info(`Saving request: ${requestData.method} ${requestData.url}`)

    const requestEntity = repositories.requests.create({
      name: `${requestData.method} ${requestData.url}`,
      url: requestData.url,
      method: requestData.method as any,
      headers: requestData.headers ? JSON.stringify(requestData.headers) : undefined,
      body: requestData.body
    } as any)

    logger.info(`Request saved with id: ${requestEntity.id}`)
    return requestEntity
  }

  async getRequests(collectionId?: number): Promise<RequestEntity[]> {
    logger.info(`Getting requests${collectionId ? ` for collection ${collectionId}` : ''}`)

    if (collectionId) {
      return repositories.requests.findByCollection(collectionId)
    }

    return repositories.requests.findAll()
  }

  async getRequestById(id: number): Promise<RequestEntity | null> {
    return repositories.requests.findById(id)
  }

  async updateRequest(id: number, updates: Partial<RequestEntity>): Promise<RequestEntity | null> {
    logger.info(`Updating request ${id}`)
    return repositories.requests.update(id, updates)
  }

  async deleteRequest(id: number): Promise<boolean> {
    logger.info(`Deleting request ${id}`)
    return repositories.requests.delete(id)
  }

  async getRequestHistory(requestId: number): Promise<HistoryEntity[]> {
    return repositories.history.findByRequest(requestId)
  }
}

export const requestService = new RequestService()
export default requestService
