import { create } from 'zustand'
import { HistoryEntity } from '../../../main/core/types'

interface HistoryState {
  history: HistoryEntity[]
  loading: boolean
  error: string | null
  fetchRecentHistory: (limit?: number) => Promise<void>
  fetchHistoryByRequest: (requestId: number) => Promise<void>
  deleteHistory: (historyId: number) => Promise<void>
  clearAllHistory: () => Promise<void>
  resetError: () => void
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  history: [],
  loading: false,
  error: null,

  fetchRecentHistory: async (limit = 50) => {
    set({ loading: true, error: null })
    try {
      const history = await window.api.history.getRecent(limit)
      set({ history, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取历史记录失败',
        loading: false
      })
    }
  },

  fetchHistoryByRequest: async (requestId: number) => {
    set({ loading: true, error: null })
    try {
      const history = await window.api.history.getByRequest(requestId)
      set({ history, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取请求历史失败',
        loading: false
      })
    }
  },

  deleteHistory: async (historyId: number) => {
    try {
      const result = await window.api.history.delete(historyId)
      if (result.success) {
        const { history } = get()
        const updatedHistory = history.filter((h) => h.id !== historyId)
        set({ history: updatedHistory })
      } else {
        set({ error: '删除历史记录失败' })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '删除历史记录失败'
      })
    }
  },

  clearAllHistory: async () => {
    try {
      const result = await window.api.history.clear()
      if (result.success) {
        set({ history: [] })
      } else {
        set({ error: '清除历史记录失败' })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '清除历史记录失败'
      })
    }
  },

  resetError: () => set({ error: null })
}))

export default useHistoryStore
