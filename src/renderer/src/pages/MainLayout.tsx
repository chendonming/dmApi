import React from 'react'
import { Box, IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import Collection from '../features/collection'
import RequestPanel from '../features/request/components/RequestPanel'
import ResponsePanel from '../features/request/components/ResponsePanel'

interface MainLayoutProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

const MainLayout: React.FC<MainLayoutProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
      {/* 顶部工具栏 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <IconButton onClick={toggleTheme} color="inherit">
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </Box>

      {/* 主体内容 */}
      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* 左侧集合面板 */}
        <Box sx={{ flex: '0 0 25%', borderRight: '1px solid', borderColor: 'divider' }}>
          <Collection />
        </Box>

        {/* 右侧请求/响应面板 */}
        <Box sx={{ flex: '0 0 75%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* 上部请求面板 */}
            <Box sx={{ flex: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
              <RequestPanel />
            </Box>

            {/* 下部响应面板 */}
            <Box sx={{ flex: 1 }}>
              <ResponsePanel />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
