import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      request: {
        send: (requestData: any) => Promise<any>
        save: (requestData: any) => Promise<{ success: boolean }>
        getAll: () => Promise<any[]>
      }
    }
  }
}
