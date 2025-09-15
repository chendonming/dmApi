import { create } from 'zustand'
import { lightTheme, darkTheme } from '../styles/theme'

interface ThemeStore {
  isDarkMode: boolean
  toggleTheme: () => void
  theme: typeof lightTheme
  editorTheme: string
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false, // 默认亮模式
  toggleTheme: () =>
    set((state) => ({
      isDarkMode: !state.isDarkMode,
      theme: !state.isDarkMode ? darkTheme : lightTheme,
      editorTheme: !state.isDarkMode ? 'vs-dark' : 'vs'
    })),
  theme: lightTheme,
  editorTheme: 'vs'
}))
