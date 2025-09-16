import { create } from 'zustand'
import { RequestData, AppResponse } from '../env.d'

export interface KeyValuePair {
  key: string
  value: string
}

interface RequestState {
  // 请求状态
  loading: boolean
  data: AppResponse | null
  error: string | null

  // URL和参数状态
  url: string
  params: KeyValuePair[]
  isUpdatingFromUrl: boolean

  // 请求历史
  requestHistory: Array<{
    id: string
    timestamp: Date
    request: RequestData
    response: AppResponse | null
    error: string | null
  }>
}

interface RequestActions {
  // 发送请求
  sendRequest: (requestData: RequestData) => Promise<void>

  // 重置状态
  reset: () => void

  // 清除历史
  clearHistory: () => void

  // 添加到历史
  addToHistory: (request: RequestData, response: AppResponse | null, error: string | null) => void

  // URL和参数管理
  setUrl: (url: string) => void
  setParams: (params: KeyValuePair[]) => void
  updateUrlFromParams: () => void
  updateParamsFromUrl: () => void
}

type RequestStore = RequestState & RequestActions

export const useRequestStore = create<RequestStore>((set, get) => ({
  // 初始状态
  loading: false,
  data: null,
  error: null,
  url: '',
  params: [],
  isUpdatingFromUrl: false,
  requestHistory: [],

  // 发送请求
  sendRequest: async (requestData: RequestData) => {
    try {
      set({ loading: true, error: null })

      const response = await window.api.request.send(requestData)

      set({ data: response, loading: false })

      // 添加到历史记录
      get().addToHistory(requestData, response, null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败'
      set({ error: errorMessage, loading: false, data: null })

      // 添加到历史记录
      get().addToHistory(requestData, null, errorMessage)
    }
  },

  // 重置状态
  reset: () => {
    set({ loading: false, data: null, error: null })
  },

  // 清除历史
  clearHistory: () => {
    set({ requestHistory: [] })
  },

  // 添加到历史
  addToHistory: (request: RequestData, response: AppResponse | null, error: string | null) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date(),
      request,
      response,
      error
    }

    set((state) => ({
      requestHistory: [newHistoryItem, ...state.requestHistory.slice(0, 49)] // 保留最新的50条记录
    }))
  },

  // 设置URL
  setUrl: (url: string) => {
    set({ url })
    // 当URL改变时，自动解析查询参数
    if (!get().isUpdatingFromUrl) {
      get().updateParamsFromUrl()
    }
  },

  // 设置参数
  setParams: (params: KeyValuePair[]) => {
    set({ params })
    // 当参数改变时，自动更新URL
    if (!get().isUpdatingFromUrl) {
      get().updateUrlFromParams()
    }
  },

  // 从参数更新URL
  updateUrlFromParams: () => {
    const { url, params } = get()
    try {
      const urlObj = new URL(url || 'http://example.com')
      // 清除现有查询参数
      urlObj.search = ''
      // 添加新的查询参数
      params.forEach((param) => {
        if (param.key.trim()) {
          urlObj.searchParams.append(param.key.trim(), param.value)
        }
      })
      const newUrl = urlObj.href
      // 防止循环更新
      set({ isUpdatingFromUrl: true })
      set({ url: newUrl })
      set({ isUpdatingFromUrl: false })
    } catch (error) {
      // URL无效时不更新
      console.warn('Invalid URL format:', error)
    }
  },

  // 从URL更新参数
  updateParamsFromUrl: () => {
    const { url } = get()
    try {
      const urlObj = new URL(url || 'http://example.com')
      const params: KeyValuePair[] = []
      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value })
      })
      // 防止循环更新
      set({ isUpdatingFromUrl: true })
      set({ params })
      set({ isUpdatingFromUrl: false })
    } catch (error) {
      // URL无效时不更新参数
      console.warn('Invalid URL format:', error)
    }
  }
}))
