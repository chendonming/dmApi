import React from 'react'
import { Box, Typography, Paper } from '@mui/material'
import Editor from '../../../components/Editor'

const ResponsePanel: React.FC = () => {
  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        响应
      </Typography>
      <Paper sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        <Typography variant="subtitle2" gutterBottom>
          状态: 200 OK
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          时间: 120ms
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          大小: 2.5 KB
        </Typography>
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
          height="300px"
          options={{
            readOnly: true
          }}
        />
      </Paper>
    </Box>
  )
}

export default ResponsePanel
