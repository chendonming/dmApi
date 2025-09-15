// HTTP 客户端实现
import { IRequestClient, RequestData, ResponseData } from './interfaces'
import { logger } from './logger'
import * as http from 'http'
import * as https from 'https'

class HttpClient implements IRequestClient {
  supports(protocol: string): boolean {
    return protocol === 'http' || protocol === 'https'
  }

  async send(request: RequestData): Promise<ResponseData> {
    return new Promise((resolve, reject) => {
      const url = new URL(request.url)
      const isHttps = url.protocol === 'https:'
      const client = isHttps ? https : http

      const options: http.RequestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: request.method,
        headers: request.headers
      }

      const req = client.request(options, (res) => {
        let data = ''

        res.on('data', (chunk) => {
          data += chunk
        })

        res.on('end', () => {
          logger.info(`HTTP Request: ${request.method} ${request.url} -> ${res.statusCode}`)
          resolve({
            status: res.statusCode || 0,
            statusText: res.statusMessage || '',
            headers: res.headers as Record<string, string>,
            data
          })
        })
      })

      req.on('error', (err) => {
        logger.error(`HTTP Request failed: ${err.message}`)
        reject(err)
      })

      if (request.body) {
        req.write(request.body)
      }

      req.end()
    })
  }
}

export { HttpClient }
