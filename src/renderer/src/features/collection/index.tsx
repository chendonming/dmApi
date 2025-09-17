import React, { useState } from 'react'
import { Box } from '@mui/material'
import LeftSidebarTabs from '../../components/LeftSidebarTabs'
import CollectionList from './CollectionList'
import History from '../history'

const Collection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 标签页 */}
      <LeftSidebarTabs activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 内容区域 */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 0 && <CollectionList />}
        {activeTab === 1 && <History />}
      </Box>
    </Box>
  )
}

export default Collection
