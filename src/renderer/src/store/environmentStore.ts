import { create } from 'zustand'

interface EnvironmentStore {
  activeEnvironmentId: string | null
  setActiveEnvironmentId: (id: string | null) => void
}

export const useEnvironmentStore = create<EnvironmentStore>((set) => ({
  activeEnvironmentId: null,
  setActiveEnvironmentId: (id) => set({ activeEnvironmentId: id })
}))
