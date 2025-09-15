import { create } from 'zustand'
import { RequestData, ResponseData } from '../env.d'

interface RequestState {
  // 请求状态
  loading: boolean
  data: ResponseData | null
  error: string | null

  // 请求历史
  requestHistory: Array<{
    id: string
    timestamp: Date
    request: RequestData
    response: ResponseData | null
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
  addToHistory: (request: RequestData, response: ResponseData | null, error: string | null) => void
}

type RequestStore = RequestState & RequestActions

export const useRequestStore = create<RequestStore>((set, get) => ({
  // 初始状态
  loading: false,
  data: null,
  error: null,
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
  addToHistory: (request: RequestData, response: ResponseData | null, error: string | null) => {
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
  }
}))
