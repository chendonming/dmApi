import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 请求相关API
  request: {
    send: (requestData: any): Promise<any> => ipcRenderer.invoke('send-request', requestData),
    save: (requestData: any): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('save-request', requestData),
    getAll: (): Promise<any[]> => ipcRenderer.invoke('get-requests')
  },

  // 集合管理相关API
  collection: {
    create: (
      name: string,
      description?: string,
      parentId?: number
    ): Promise<{ success: boolean; data: any }> =>
      ipcRenderer.invoke('create-collection', name, description, parentId),
    getAll: (parentId?: number): Promise<any[]> => ipcRenderer.invoke('get-collections', parentId),
    getTree: (): Promise<any[]> => ipcRenderer.invoke('get-collection-tree'),
    getById: (id: number): Promise<any> => ipcRenderer.invoke('get-collection-by-id', id),
    update: (id: number, updates: any): Promise<{ success: boolean; data: any }> =>
      ipcRenderer.invoke('update-collection', id, updates),
    delete: (id: number): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('delete-collection', id),
    move: (id: number, newParentId?: number): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('move-collection', id, newParentId)
  },

  // 历史记录相关API
  history: {
    getRecent: (limit?: number): Promise<any[]> => ipcRenderer.invoke('get-recent-history', limit),
    getByRequest: (requestId: number): Promise<any[]> =>
      ipcRenderer.invoke('get-request-history', requestId),
    delete: (historyId: number): Promise<{ success: boolean }> =>
      ipcRenderer.invoke('delete-history', historyId),
    clear: (): Promise<{ success: boolean; deletedCount: number }> =>
      ipcRenderer.invoke('clear-history')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
