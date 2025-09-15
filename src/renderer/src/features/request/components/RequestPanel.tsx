import React, { useState } from 'react'
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  Tabs,
  Tab,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material'
import KeyValueEditor, { KeyValuePair } from '../../../components/KeyValueEditor'

const RequestPanel: React.FC = () => {
  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [tabValue, setTabValue] = useState(0)
  const [params, setParams] = useState<KeyValuePair[]>([])
  const [auth, setAuth] = useState<KeyValuePair[]>([])
  const [bodyType, setBodyType] = useState<
    'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary'
  >('none')
  const [bodyValues, setBodyValues] = useState<KeyValuePair[]>([])
  const [rawType, setRawType] = useState<'Text' | 'JavaScript' | 'JSON' | 'HTML' | 'XML'>('Text')
  const [rawContent, setRawContent] = useState('')

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue)
  }

  const handleSend = (): void => {
    // TODO: Implement send request logic
    console.log('Send request:', { method, url, params, auth, bodyType, bodyValues })
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 第一行：方法选择、URL输入、发送按钮 */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          size="small"
          sx={{ minWidth: 100 }}
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
          <MenuItem value="PATCH">PATCH</MenuItem>
          <MenuItem value="HEAD">HEAD</MenuItem>
          <MenuItem value="OPTIONS">OPTIONS</MenuItem>
        </Select>
        <TextField
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter request URL"
          fullWidth
          size="small"
        />
        <Button variant="contained" onClick={handleSend}>
          Send
        </Button>
      </Box>

      {/* 参数标签页 */}
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Params" />
        <Tab label="Auth" />
        <Tab label="Body" />
      </Tabs>

      <Box sx={{ flex: 1, overflow: 'auto', mt: 2 }}>
        {tabValue === 0 && <KeyValueEditor value={params} onChange={setParams} />}
        {tabValue === 1 && <KeyValueEditor value={auth} onChange={setAuth} />}
        {tabValue === 2 && (
          <Box>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Body Type</FormLabel>
              <RadioGroup
                row
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as typeof bodyType)}
              >
                <FormControlLabel value="none" control={<Radio />} label="none" />
                <FormControlLabel value="form-data" control={<Radio />} label="form-data" />
                <FormControlLabel
                  value="x-www-form-urlencoded"
                  control={<Radio />}
                  label="x-www-form-urlencoded"
                />
                <FormControlLabel value="raw" control={<Radio />} label="raw" />
                <FormControlLabel value="binary" control={<Radio />} label="binary" />
              </RadioGroup>
            </FormControl>
            {bodyType === 'none' && null}
            {(bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') && (
              <KeyValueEditor value={bodyValues} onChange={setBodyValues} />
            )}
            {bodyType === 'raw' && (
              <Box>
                <Select
                  value={rawType}
                  onChange={(e) => setRawType(e.target.value as typeof rawType)}
                  size="small"
                  sx={{ mb: 2, minWidth: 120 }}
                >
                  <MenuItem value="Text">Text</MenuItem>
                  <MenuItem value="JavaScript">JavaScript</MenuItem>
                  <MenuItem value="JSON">JSON</MenuItem>
                  <MenuItem value="HTML">HTML</MenuItem>
                  <MenuItem value="XML">XML</MenuItem>
                </Select>
                <TextField
                  value={rawContent}
                  onChange={(e) => setRawContent(e.target.value)}
                  multiline
                  rows={10}
                  fullWidth
                  placeholder="Enter raw content"
                />
              </Box>
            )}
            {bodyType === 'binary' && (
              <Button variant="outlined" component="label">
                Upload File
                <input type="file" hidden />
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default RequestPanel
