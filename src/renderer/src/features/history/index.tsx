import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearIcon from '@mui/icons-material/Clear'
import { useHistoryStore } from '../../store/historyStore'

const History: React.FC = () => {
  const { history, loading, error, fetchRecentHistory, deleteHistory, clearAllHistory } =
    useHistoryStore()

  const [selectedHistory, setSelectedHistory] = useState<any>(null)

  useEffect(() => {
    fetchRecentHistory(50)
  }, [fetchRecentHistory])

  const handleDeleteHistory = async (historyId: number) => {
    await deleteHistory(historyId)
  }

  const handleClearHistory = async () => {
    await clearAllHistory()
  }

  const handleHistoryClick = (historyItem: any) => {
    setSelectedHistory(historyItem)
    // TODO: 加载详细的历史记录信息
  }

  const getMethodColor = (method: string) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'success'
      case 'POST':
        return 'info'
      case 'PUT':
        return 'warning'
      case 'DELETE':
        return 'error'
      case 'PATCH':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 标题栏 */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">历史记录</Typography>
        <IconButton
          onClick={handleClearHistory}
          disabled={history.length === 0}
          title="清除所有历史记录"
        >
          <ClearIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* 历史记录列表 */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {history.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              暂无历史记录
            </Typography>
          </Box>
        ) : (
          <List>
            {history.map((item) => (
              <ListItem
                key={item.id}
                button
                onClick={() => handleHistoryClick(item)}
                sx={{ '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Chip
                        label={item.request?.method || 'UNKNOWN'}
                        size="small"
                        color={getMethodColor(item.request?.method)}
                        variant="outlined"
                      />
                      <Typography variant="body2" sx={{ flex: 1, fontFamily: 'monospace' }}>
                        {item.request?.url || 'Unknown URL'}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {formatTime(item.executed_at)}
                      </Typography>
                      {item.response_status && (
                        <Chip
                          label={item.response_status}
                          size="small"
                          color={
                            item.response_status >= 200 && item.response_status < 300
                              ? 'success'
                              : 'error'
                          }
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteHistory(item.id)}
                    title="删除历史记录"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  )
}

export default History
