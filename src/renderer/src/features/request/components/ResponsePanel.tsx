import React, { useState } from 'react'
import { Box, Typography, Paper, CircularProgress, Alert, Tabs, Tab } from '@mui/material'
import Editor from '../../../components/Editor'
import { useIpcRequest } from '../../../hooks/useIpcRequest'

const ResponsePanel: React.FC = () => {
  const { loading, data, error } = useIpcRequest()
  const [tabValue, setTabValue] = useState(0)

  const getStatusColor = (statusCode: number): string => {
    if (statusCode >= 200 && statusCode < 300) return 'success.main'
    if (statusCode >= 300 && statusCode < 400) return 'warning.main'
    if (statusCode >= 400) return 'error.main'
    return 'grey.500'
  }

  const getTimeColor = (): string => {
    // 这里可以根据实际响应时间来设置颜色
    return 'text.secondary'
  }

  const getContentType = (headers: Record<string, string>): string => {
    return headers['content-type'] || 'text/plain'
  }

  const getLanguage = (contentType: string): string => {
    if (contentType.includes('json')) return 'json'
    if (contentType.includes('xml')) return 'xml'
    if (contentType.includes('html')) return 'html'
    if (contentType.includes('javascript')) return 'javascript'
    return 'text'
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        响应
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>正在发送请求...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          请求失败: {error}
        </Alert>
      )}

      {data && !loading && (
        <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 4, mb: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: getStatusColor(data.status)
                }}
              />
              <Typography variant="subtitle2">
                状态: {data.status} {data.statusText}
              </Typography>
            </Box>
            <Typography variant="subtitle2" color={getTimeColor()}>
              大小: {data.formattedBody?.length || 0} 字节
            </Typography>
          </Box>

          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="响应头" />
            <Tab label="响应内容" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Box
                component="pre"
                sx={{
                  fontSize: '12px',
                  backgroundColor: 'grey.100',
                  p: 1,
                  borderRadius: 1,
                  overflow: 'auto'
                }}
              >
                {Object.entries(data.headers)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')}
              </Box>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ mt: 2 }}>
              <Editor
                value={data.formattedBody || '(空响应)'}
                onChange={() => {}} // 只读，不需要onChange
                language={getLanguage(getContentType(data.headers))}
                height="300px"
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  wordWrap: 'on'
                }}
              />
            </Box>
          )}
        </Paper>
      )}

      {!loading && !error && !data && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Typography color="text.secondary">发送请求后将在此处显示响应</Typography>
        </Box>
      )}
    </Box>
  )
}

export default ResponsePanel
