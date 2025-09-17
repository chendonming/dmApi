import React from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import CollectionsIcon from '@mui/icons-material/Collections'
import HistoryIcon from '@mui/icons-material/History'

interface LeftSidebarTabsProps {
  activeTab: number
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void
}

const LeftSidebarTabs: React.FC<LeftSidebarTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTab} onChange={onTabChange} aria-label="sidebar tabs">
        <Tab
          icon={<CollectionsIcon />}
          label="集合管理"
          iconPosition="start"
          sx={{ minHeight: 48 }}
        />
        <Tab icon={<HistoryIcon />} label="历史记录" iconPosition="start" sx={{ minHeight: 48 }} />
      </Tabs>
    </Box>
  )
}

export default LeftSidebarTabs
