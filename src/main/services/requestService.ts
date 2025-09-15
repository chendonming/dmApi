// 服务层：请求服务
import { logger } from '../core/logger'
import { requestManager } from '../core/requestManager'
import { RequestData, ResponseData } from '../core/interfaces'
import { database } from '../core/database'

class RequestService {
  async sendRequest(requestData: RequestData): Promise<ResponseData> {
    logger.info(`Sending request: ${requestData.method} ${requestData.url}`)

    // 调用 RequestManager 发送请求
    const response = await requestManager.sendRequest(requestData)

    logger.info(`Request completed with status: ${response.status}`)

    // TODO: 保存请求响应到数据库
    // await database.query('INSERT INTO requests ...', [/* params */])

    return response
  }

  async saveRequest(requestData: RequestData): Promise<void> {
    // TODO: 实现保存请求逻辑
    logger.info('Saving request (placeholder)')
    // await database.query('INSERT INTO requests ...', [/* params */])
  }

  async getRequests(): Promise<any[]> {
    // TODO: 获取请求列表
    logger.info('Getting requests (placeholder)')
    // return await database.query('SELECT * FROM requests')
    return []
  }
}

export const requestService = new RequestService()
export default requestService
