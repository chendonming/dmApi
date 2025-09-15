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
