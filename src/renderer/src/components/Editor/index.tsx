import React from 'react'
import Editor from '@monaco-editor/react'

interface EditorProps {
  value: string
  onChange: (value: string | undefined) => void
  language?: string
  height?: string | number
  theme?: string
  options?: React.ComponentProps<typeof Editor>['options']
}

const CodeEditor: React.FC<EditorProps> = ({
  value,
  onChange,
  language = 'json',
  height = '200px',
  theme = 'vs-dark',
  options = {}
}) => {
  return (
    <Editor
      value={value}
      onChange={onChange}
      language={language}
      height={height}
      theme={theme}
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
