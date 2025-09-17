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

export interface AppResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  rawBody: string
  formattedBody: string
}

// IPC API 类型定义
declare global {
  interface Window {
    api: {
      request: {
        send: (requestData: RequestData) => Promise<any>
        save: (requestData: RequestData) => Promise<{ success: boolean }>
        getAll: () => Promise<any[]>
      }
      collection: {
        create: (
          name: string,
          description?: string,
          parentId?: number
        ) => Promise<{ success: boolean; data: any }>
        getAll: (parentId?: number) => Promise<any[]>
        getTree: () => Promise<any[]>
        getById: (id: number) => Promise<any>
        update: (id: number, updates: any) => Promise<{ success: boolean; data: any }>
        delete: (id: number) => Promise<{ success: boolean }>
        move: (id: number, newParentId?: number) => Promise<{ success: boolean }>
      }
      history: {
        getRecent: (limit?: number) => Promise<any[]>
        getByRequest: (requestId: number) => Promise<any[]>
        delete: (historyId: number) => Promise<{ success: boolean }>
        clear: () => Promise<{ success: boolean; deletedCount: number }>
      }
    }
  }
}
