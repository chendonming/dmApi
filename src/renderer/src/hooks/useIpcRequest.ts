import { useRequestStore } from '../store'
import { RequestData, AppResponse } from '../env.d'
import { KeyValuePair } from '../components/KeyValueEditor'

export interface UseIpcRequestReturn {
  loading: boolean
  data: AppResponse | null
  error: string | null
  sendRequest: (requestData: RequestData) => Promise<void>
  reset: () => void
}

export interface RequestFormData {
  method: string
  url: string
  params: KeyValuePair[]
  auth: KeyValuePair[]
  headers: KeyValuePair[]
  bodyType: 'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary'
  bodyValues: KeyValuePair[]
  rawType: 'Text' | 'JavaScript' | 'JSON' | 'HTML' | 'XML'
  rawContent: string
}

export const useIpcRequest = (): UseIpcRequestReturn => {
  const { loading, data, error, sendRequest, reset } = useRequestStore()

  return {
    loading,
    data,
    error,
    sendRequest,
    reset
  }
}

// 辅助函数：将表单数据转换为RequestData
export const formDataToRequestData = (formData: RequestFormData): RequestData => {
  const { method, url, params, auth, headers, bodyType, bodyValues, rawContent } = formData

  // 构建headers
  const requestHeaders: Record<string, string> = {}

  // 添加headers
  headers.forEach(({ key, value }) => {
    if (key && value) {
      requestHeaders[key] = value
    }
  })

  // 添加认证头
  auth.forEach(({ key, value }) => {
    if (key && value) {
      requestHeaders[key] = value
    }
  })

  // 构建URL（包含查询参数）
  let fullUrl = url
  const queryParams: string[] = []

  params.forEach(({ key, value }) => {
    if (key && value) {
      queryParams.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  })

  if (queryParams.length > 0) {
    fullUrl += (url.includes('?') ? '&' : '?') + queryParams.join('&')
  }

  // 构建请求体
  let body: string | undefined

  if (bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') {
    const formDataObj = new URLSearchParams()
    bodyValues.forEach(({ key, value }) => {
      if (key && value) {
        formDataObj.append(key, value)
      }
    })
    body = formDataObj.toString()

    if (bodyType === 'form-data') {
      requestHeaders['Content-Type'] = 'multipart/form-data'
    } else {
      requestHeaders['Content-Type'] = 'application/x-www-form-urlencoded'
    }
  } else if (bodyType === 'raw') {
    body = rawContent
    requestHeaders['Content-Type'] = 'application/json' // 默认JSON，可根据rawType调整
  }

  return {
    method,
    url: fullUrl,
    headers: Object.keys(requestHeaders).length > 0 ? requestHeaders : undefined,
    body
  }
}
