import React, { useState, useRef } from 'react'
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
  FormLabel,
  CircularProgress
} from '@mui/material'
import KeyValueEditor, { KeyValuePair } from '../../../components/KeyValueEditor'
import Editor from '../../../components/Editor'
import { useIpcRequest, formDataToRequestData, RequestFormData } from '../../../hooks/useIpcRequest'
import { useRequestStore } from '../../../store/requestStore'

const RequestPanel: React.FC = () => {
  const [method, setMethod] = useState('GET')
  const [urlMultiline, setUrlMultiline] = useState(false)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const [tabValue, setTabValue] = useState(0)
  const [auth, setAuth] = useState<KeyValuePair[]>([])
  const [bodyType, setBodyType] = useState<
    'none' | 'form-data' | 'x-www-form-urlencoded' | 'raw' | 'binary'
  >('none')
  const [bodyValues, setBodyValues] = useState<KeyValuePair[]>([])
  const [rawType, setRawType] = useState<'Text' | 'JavaScript' | 'JSON' | 'HTML' | 'XML'>('Text')
  const [rawContent, setRawContent] = useState('')

  const { loading, sendRequest } = useIpcRequest()
  const { url, params, setUrl, setParams } = useRequestStore()

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setTabValue(newValue)
  }

  const handleSend = async (): Promise<void> => {
    const formData: RequestFormData = {
      method,
      url,
      params,
      auth,
      bodyType,
      bodyValues,
      rawType,
      rawContent
    }

    const requestData = formDataToRequestData(formData)
    await sendRequest(requestData)
  }

  const getLanguage = (type: typeof rawType): string => {
    switch (type) {
      case 'JSON':
        return 'json'
      case 'JavaScript':
        return 'javascript'
      case 'HTML':
        return 'html'
      case 'XML':
        return 'xml'
      default:
        return 'text'
    }
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* 第一行：方法选择、URL输入、发送按钮 */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          size="small"
          sx={{ flex: '0 0 auto', minWidth: { xs: 70, sm: 80, md: 100 } }}
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
          size="small"
          multiline={urlMultiline}
          onFocus={() => {
            setUrlMultiline(true)
            setTimeout(() => urlInputRef.current?.focus(), 0)
          }}
          onBlur={() => setUrlMultiline(false)}
          inputRef={urlInputRef}
          sx={{ flex: 1, minWidth: 0 }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={loading}
          sx={{ flex: '0 0 auto', minWidth: { xs: 60, sm: 70, md: 80 } }}
        >
          {loading ? <CircularProgress size={20} /> : 'Send'}
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
                <Editor
                  value={rawContent}
                  onChange={(value) => setRawContent(value || '')}
                  language={getLanguage(rawType)}
                  height="300px"
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
