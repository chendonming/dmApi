import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Box
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export interface KeyValuePair {
  key: string
  value: string
}

interface KeyValueEditorProps {
  value: KeyValuePair[]
  onChange: (value: KeyValuePair[]) => void
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ value, onChange }) => {
  const handleAdd = (): void => {
    onChange([...value, { key: '', value: '' }])
  }

  const handleDelete = (index: number): void => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const handleChange = (index: number, field: 'key' | 'value', newValue: string): void => {
    const updated = value.map((item, i) => (i === index ? { ...item, [field]: newValue } : item))
    onChange(updated)
  }

  return (
    <Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
            <TableCell width="50px"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value.map((pair, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  value={pair.key}
                  onChange={(e) => handleChange(index, 'key', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  fullWidth
                  value={pair.value}
                  onChange={(e) => handleChange(index, 'value', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => handleDelete(index)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button startIcon={<AddIcon />} onClick={handleAdd} sx={{ mt: 1 }} size="small">
        Add
      </Button>
    </Box>
  )
}

export default KeyValueEditor
