import React, { useState } from 'react'
import { Box, Tabs, Tab, Typography, TextField, Button } from '@mui/material'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps): React.ReactElement {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`request-tabpanel-${index}`}
      aria-labelledby={`request-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const RequestPanel: React.FC = () => {
  const [value, setValue] = useState(0)

  const handleChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="request tabs">
          <Tab label="GET" />
          <Tab label="POST" />
          <Tab label="PUT" />
          <Tab label="DELETE" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Typography variant="h6">GET 请求</Typography>
        <TextField label="URL" fullWidth margin="normal" />
        <Button variant="contained" color="primary">
          发送请求
        </Button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h6">POST 请求</Typography>
        <TextField label="URL" fullWidth margin="normal" />
        <TextField label="Body" multiline rows={4} fullWidth margin="normal" />
        <Button variant="contained" color="primary">
          发送请求
        </Button>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Typography variant="h6">PUT 请求</Typography>
        <TextField label="URL" fullWidth margin="normal" />
        <TextField label="Body" multiline rows={4} fullWidth margin="normal" />
        <Button variant="contained" color="primary">
          发送请求
        </Button>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography variant="h6">DELETE 请求</Typography>
        <TextField label="URL" fullWidth margin="normal" />
        <Button variant="contained" color="primary">
          发送请求
        </Button>
      </TabPanel>
    </Box>
  )
}

export default RequestPanel
