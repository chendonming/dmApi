import { create } from 'zustand'

interface Tab {
  id: string
  name: string
  type: 'request' | 'response'
  isActive: boolean
}

interface TabsStore {
  tabs: Tab[]
  activeTabId: string | null
  addTab: (tab: Omit<Tab, 'isActive'>) => void
  removeTab: (id: string) => void
  setActiveTab: (id: string) => void
}

export const useTabsStore = create<TabsStore>((set) => ({
  tabs: [],
  activeTabId: null,
  addTab: (tab) =>
    set((state) => {
      const newTab = { ...tab, isActive: false }
      const updatedTabs = state.tabs.map((t) => ({ ...t, isActive: false }))
      return {
        tabs: [...updatedTabs, newTab],
        activeTabId: newTab.id
      }
    }),
  removeTab: (id) =>
    set((state) => {
      const filteredTabs = state.tabs.filter((t) => t.id !== id)
      const wasActive = state.activeTabId === id
      let newActiveId = state.activeTabId
      if (wasActive && filteredTabs.length > 0) {
        newActiveId = filteredTabs[filteredTabs.length - 1].id
      } else if (wasActive) {
        newActiveId = null
      }
      return {
        tabs: filteredTabs,
        activeTabId: newActiveId
      }
    }),
  setActiveTab: (id) =>
    set((state) => ({
      tabs: state.tabs.map((t) => ({ ...t, isActive: t.id === id })),
      activeTabId: id
    }))
}))
