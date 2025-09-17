import React, { useState, useRef, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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

interface EditingCell {
  rowIndex: number
  col: 'key' | 'value'
}

const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ value, onChange }) => {
  const [editing, setEditing] = useState<EditingCell | null>(null)
  const [tempValue, setTempValue] = useState('')
  const editRef = useRef<HTMLDivElement>(null)

  const handleAdd = (): void => {
    onChange([...value, { key: '', value: '' }])
  }

  const handleDelete = (index: number): void => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
  }

  const handleCellClick = (rowIndex: number, col: 'key' | 'value'): void => {
    const currentText = value[rowIndex][col]
    setTempValue(currentText)
    setEditing({ rowIndex, col })
  }

  const handleInput = (e: React.FormEvent<HTMLDivElement>): void => {
    setTempValue(e.currentTarget.textContent || '')
  }

  const handleSave = (): void => {
    if (editing) {
      const updated = value.map((item, i) =>
        i === editing.rowIndex ? { ...item, [editing.col]: tempValue.trim() } : item
      )
      onChange(updated)
      setEditing(null)
      setTempValue('')
    }
  }

  const handleCancel = (): void => {
    setEditing(null)
    setTempValue('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      handleCancel()
    }
  }

  useEffect(() => {
    if (editing && editRef.current) {
      editRef.current.textContent = tempValue
      editRef.current.focus()
      // Move cursor to end
      const range = document.createRange()
      const selection = window.getSelection()
      range.selectNodeContents(editRef.current)
      range.collapse(false)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing])

  const renderCell = (rowIndex: number, col: 'key' | 'value', text: string): React.ReactElement => {
    const isEditing = editing && editing.rowIndex === rowIndex && editing.col === col

    if (isEditing) {
      return (
        <Box
          ref={editRef}
          component="div"
          contentEditable
          suppressContentEditableWarning
          sx={{
            cursor: 'text',
            minHeight: '32px',
            display: 'flex',
            alignItems: 'flex-start',
            padding: '8px 14px',
            borderRadius: '4px',
            outline: 'none',
            border: '1px solid #1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            overflowWrap: 'break-word',
            wordBreak: 'break-all',
            maxWidth: '100%'
          }}
          onInput={handleInput}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      )
    }

    return (
      <Box
        component="div"
        sx={{
          cursor: 'pointer',
          minHeight: '32px',
          display: 'flex',
          alignItems: 'flex-start',
          padding: '8px 14px',
          borderRadius: '4px',
          outline: 'none',
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          color: text ? 'text.primary' : 'text.secondary',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'break-word',
          wordBreak: 'break-all',
          maxWidth: '100%',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
        onClick={() => handleCellClick(rowIndex, col)}
      >
        {text || (col === 'key' ? 'Click to add key' : 'Click to add value')}
      </Box>
    )
  }

  return (
    <Box>
      <Table size="small" sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '50%' }}>Key</TableCell>
            <TableCell sx={{ width: '50%' }}>Value</TableCell>
            <TableCell width="50px"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {value.map((pair, index) => (
            <TableRow key={index}>
              <TableCell sx={{ p: 1 }}>{renderCell(index, 'key', pair.key)}</TableCell>
              <TableCell sx={{ p: 1 }}>{renderCell(index, 'value', pair.value)}</TableCell>
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
