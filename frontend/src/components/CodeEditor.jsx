import Editor from '@monaco-editor/react';

export default function CodeEditor({ code, language, theme, onChange, onCursorChange }) {
  function handleMount(editor, monaco) {
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange({ line: e.position.lineNumber, column: e.position.column });
    });
    editor.focus();
  }

  return (
    <div className="editor-wrap">
      <Editor
        height="100%"
        language={language}
        value={code}
        theme={theme}
        onChange={(value) => onChange(value ?? '')}
        onMount={handleMount}
        options={{
          fontSize: 14,
          minimap: { enabled: true },
          automaticLayout: true,
          folding: true,
          matchBrackets: 'always',
          autoIndent: 'full',
          formatOnType: true,
          scrollBeyondLastLine: false,
          padding: { top: 12 }
        }}
      />
    </div>
  );
}
