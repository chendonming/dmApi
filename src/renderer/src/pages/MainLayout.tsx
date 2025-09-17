import React, { useState, Fragment } from 'react'
import { Box, IconButton, Drawer } from '@mui/material'
import { Brightness4, Brightness7, Menu } from '@mui/icons-material'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'
import LeftSidebar from '../features/collection'
import RequestPanel from '../features/request/components/RequestPanel'
import ResponsePanel from '../features/request/components/ResponsePanel'

interface MainLayoutProps {
  toggleTheme: () => void
  isDarkMode: boolean
}

const MainLayout: React.FC<MainLayoutProps> = ({ toggleTheme, isDarkMode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = (): void => setDrawerOpen(!drawerOpen)

  return (
    <Fragment>
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
          <IconButton
            onClick={toggleDrawer}
            color="inherit"
            sx={{ display: { xs: 'block', md: 'none' } }}
          >
            <Menu />
          </IconButton>
          <IconButton onClick={toggleTheme} color="inherit">
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>

        {/* 主体内容 */}
        <Box sx={{ display: 'flex', flexDirection: 'row', flex: 1, height: 0 }}>
          {/* 左侧集合面板 - 大屏幕显示 */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              flex: '0 0 250px',
              borderRight: '1px solid',
              borderColor: 'divider'
            }}
          >
            <LeftSidebar />
          </Box>

          {/* 右侧请求/响应面板 */}
          <Box sx={{ flex: 1, width: 0 }}>
            <PanelGroup direction="vertical" style={{ height: '100%' }}>
              {/* 上部请求面板 */}
              <Panel defaultSize={50} minSize={20}>
                <RequestPanel />
              </Panel>

              <PanelResizeHandle style={{ height: '4px', backgroundColor: '#e0e0e0' }} />

              {/* 下部响应面板 */}
              <Panel defaultSize={50} minSize={20}>
                <ResponsePanel />
              </Panel>
            </PanelGroup>
          </Box>
        </Box>
      </Box>
      {/* 侧边栏抽屉 - 小屏幕使用 */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
      >
        <Box sx={{ width: 300 }}>
          <LeftSidebar />
        </Box>
      </Drawer>
    </Fragment>
  )
}

export default MainLayout
