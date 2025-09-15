// 基础 HTTP 请求管理模块
import { IRequestClient, RequestData, AppResponse } from './interfaces'
import { HttpClient } from './httpClient'

// 重新导出类型，便于其他模块导入
export type { RequestData, AppResponse }

class RequestManager {
  private clients: IRequestClient[] = []

  constructor() {
    this.clients.push(new HttpClient())
  }

  async sendRequest(request: RequestData): Promise<AppResponse> {
    const url = new URL(request.url)
    const protocol = url.protocol.replace(':', '')

    const client = this.clients.find((c) => c.supports(protocol))
    if (!client) {
      throw new Error(`Unsupported protocol: ${protocol}`)
    }

    return client.send(request)
  }

  registerClient(client: IRequestClient): void {
    this.clients.push(client)
  }
}

export const requestManager = new RequestManager()
export default requestManager
