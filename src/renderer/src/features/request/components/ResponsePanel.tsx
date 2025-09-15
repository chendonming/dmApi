import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import Editor from '../../../components/Editor'

const ResponsePanel: React.FC = () => {
  const statusCode = 200 // 假设状态码为200，可根据实际响应动态获取
  let color = 'gray'
  if (statusCode === 200) color = 'green'
  else if (statusCode >= 400) color = 'red'
  else if (statusCode >= 300) color = 'yellow'

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        响应
      </Typography>
      <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color }} />
            <Typography variant="subtitle2">状态: 200 OK</Typography>
          </Box>
          <Typography variant="subtitle2">时间: 120ms</Typography>
          <Typography variant="subtitle2">大小: 2.5 KB</Typography>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          响应内容预览:
        </Typography>
        <Editor
          value={`{
  "status": "success",
  "data": {
    "message": "这是示例响应数据"
  }
}`}
          onChange={() => {}} // 只读，不需要onChange
          language="json"
          options={{
            readOnly: true
          }}
        />
      </Paper>
    </Box>
  )
}

export default ResponsePanel
