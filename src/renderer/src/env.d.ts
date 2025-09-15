/// <reference types="vite/client" />

// 共享接口定义
export interface RequestData {
  method: string
  url: string
  headers?: Record<string, string>
  body?: string
}

export interface ResponseData {
  status: number
  statusText: string
  headers: Record<string, string>
  data: string
}
