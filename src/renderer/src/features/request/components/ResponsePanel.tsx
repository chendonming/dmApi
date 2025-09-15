import React from 'react'
import { Box, Typography, Paper, TextField } from '@mui/material'

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
        <TextField
          multiline
          fullWidth
          rows={10}
          variant="outlined"
          sx={{ mt: 1 }}
          value='{
  "status": "success",
  "data": {
    "message": "这是示例响应数据"
  }
}'
          InputProps={{
            readOnly: true
          }}
        />
      </Paper>
    </Box>
  )
}

export default ResponsePanel
