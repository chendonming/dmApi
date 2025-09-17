import { create } from 'zustand'
import { CollectionEntity } from '../../../main/core/types'

interface CollectionState {
  collections: CollectionEntity[]
  treeData: CollectionEntity[]
  loading: boolean
  error: string | null
  fetchCollections: (parentId?: number) => Promise<void>
  fetchTree: () => Promise<void>
  createCollection: (name: string, description?: string, parentId?: number) => Promise<void>
  updateCollection: (id: number, updates: Partial<CollectionEntity>) => Promise<void>
  deleteCollection: (id: number) => Promise<void>
  moveCollection: (id: number, newParentId?: number) => Promise<void>
  resetError: () => void
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  treeData: [],
  loading: false,
  error: null,

  fetchCollections: async (parentId?: number) => {
    set({ loading: true, error: null })
    try {
      const collections = await window.api.collection.getAll(parentId)
      set({ collections, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取集合失败',
        loading: false
      })
    }
  },

  fetchTree: async () => {
    set({ loading: true, error: null })
    try {
      const treeData = await window.api.collection.getTree()
      set({ treeData, loading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '获取集合树失败',
        loading: false
      })
    }
  },

  createCollection: async (name: string, description?: string, parentId?: number) => {
    try {
      const result = await window.api.collection.create(name, description, parentId)
      if (result.success) {
        // 重新获取数据
        await get().fetchTree()
        await get().fetchCollections()
      } else {
        set({ error: '创建集合失败' })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '创建集合失败'
      })
    }
  },

  updateCollection: async (id: number, updates: Partial<CollectionEntity>) => {
    try {
      const result = await window.api.collection.update(id, updates)
      if (result.success) {
        // 重新获取数据
        await get().fetchTree()
        await get().fetchCollections()
      } else {
        set({ error: '更新集合失败' })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '更新集合失败'
      })
    }
  },

  deleteCollection: async (id: number) => {
    try {
      const result = await window.api.collection.delete(id)
      if (result.success) {
        // 重新获取数据
        await get().fetchTree()
        await get().fetchCollections()
      } else {
        set({ error: '删除集合失败' })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '删除集合失败'
      })
    }
  },

  moveCollection: async (id: number, newParentId?: number) => {
    try {
      const result = await window.api.collection.move(id, newParentId)
      if (result.success) {
        // 重新获取数据
        await get().fetchTree()
      } else {
        set({ error: '移动集合失败' })
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '移动集合失败'
      })
    }
  },

  resetError: () => set({ error: null })
}))

export default useCollectionStore
