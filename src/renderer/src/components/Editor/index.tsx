import React from 'react'
import Editor from '@monaco-editor/react'
import { useThemeStore } from '../../store'

interface EditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: string
  height?: string | number
  options?: React.ComponentProps<typeof Editor>['options']
}

const CodeEditor: React.FC<EditorProps> = ({
  value,
  onChange,
  language = 'json',
  height = '200px',
  options = {}
}) => {
  const { editorTheme } = useThemeStore()

  return (
    <Editor
      value={value}
      onChange={onChange}
      language={language}
      height={height}
      theme={editorTheme}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: 'on',
        ...options
      }}
    />
  )
}

export default CodeEditor
