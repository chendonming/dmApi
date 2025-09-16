// HTTP 客户端实现
import { IRequestClient, RequestData, AppResponse } from './interfaces'
import { logger } from './logger'
import axios, { AxiosResponse } from 'axios'
import prettier from 'prettier'

class HttpClient implements IRequestClient {
  supports(protocol: string): boolean {
    return protocol === 'http' || protocol === 'https'
  }

  private async formatCode(rawBody: string, contentType?: string): Promise<string> {
    if (!rawBody || !contentType) return rawBody

    try {
      const contentTypeLower = contentType.toLowerCase()

      if (contentTypeLower.includes('application/json')) {
        // JSON 格式化
        const parsed = JSON.parse(rawBody)
        return await prettier.format(JSON.stringify(parsed, null, 2), { parser: 'json' })
      } else if (
        contentTypeLower.includes('text/html') ||
        contentTypeLower.includes('application/xml') ||
        contentTypeLower.includes('text/xml')
      ) {
        // HTML/XML 格式化
        const parser = contentTypeLower.includes('html') ? 'html' : 'xml'
        return await prettier.format(rawBody, { parser })
      } else if (
        contentTypeLower.includes('text/javascript') ||
        contentTypeLower.includes('application/javascript')
      ) {
        // JavaScript 格式化
        return await prettier.format(rawBody, { parser: 'javascript' })
      } else if (contentTypeLower.includes('text/css')) {
        // CSS 格式化
        return await prettier.format(rawBody, { parser: 'css' })
      }
    } catch (error) {
      logger.warn(`Failed to format response body: ${(error as Error).message}`)
    }

    return rawBody // 返回原始内容如果格式化失败
  }

  async send(request: RequestData): Promise<AppResponse> {
    try {
      logger.info(`Sending HTTP request: ${request.method} ${request.url}`)

      const axiosConfig = {
        method: request.method,
        url: request.url,
        headers: request.headers,
        data: request.body,
        timeout: 30000, // 30秒超时
        validateStatus: () => true // 不抛出HTTP错误状态，让调用方处理
      }

      const response: AxiosResponse = await axios(axiosConfig)

      const rawBody =
        typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
      const contentType = response.headers['content-type'] || ''
      const formattedBody = await this.formatCode(rawBody, contentType)

      logger.info(`HTTP Request completed: ${request.method} ${request.url} -> ${response.status}`)

      const appResponse: AppResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers as Record<string, string>,
        rawBody,
        formattedBody
      }

      return appResponse
    } catch (error) {
      logger.error(`HTTP Request failed: ${(error as Error).message}`)
      throw error
    }
  }
}

export { HttpClient }
