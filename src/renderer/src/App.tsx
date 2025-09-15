import React from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import MainLayout from './pages/MainLayout'
import { useThemeStore } from './store'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App(): React.JSX.Element {
  const { theme, toggleTheme, isDarkMode } = useThemeStore()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </ThemeProvider>
  )
}

export default App
