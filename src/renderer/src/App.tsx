import React, { useState } from 'react'
import { ThemeProvider, CssBaseline } from '@mui/material'
import MainLayout from './pages/MainLayout'
import { lightTheme, darkTheme } from './styles/theme'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

function App(): React.JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = (): void => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <MainLayout toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
    </ThemeProvider>
  )
}

export default App
