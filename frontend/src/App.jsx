import { useCallback, useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import CodeEditor from './components/CodeEditor.jsx';
import StatusBar from './components/StatusBar.jsx';
import FileDialog from './components/FileDialog.jsx';
import Toast from './components/Toast.jsx';
import { SAMPLE_CODE, extensionFor } from './data/sampleCode.js';
import * as api from './services/api.js';

export default function App() {
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState('');
  const [code, setCode] = useState(SAMPLE_CODE);
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const [connected, setConnected] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const refreshFiles = useCallback(async () => {
    try {
      const list = await api.fetchFiles();
      setFiles(list || []);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  async function handleSelect(name) {
    try {
      const file = await api.fetchFile(name);
      setActiveFile(file.name);
      setCode(file.content ?? '');
      setLanguage(file.language ?? 'javascript');
      setDirty(false);
    } catch (err) {
      showToast(err.message);
    }
  }

  async function handleSave() {
    if (!activeFile) {
      setDialogOpen(true);
      showToast('Create a file first, then save.');
      return;
    }
    setSaving(true);
    try {
      try {
        await api.updateFile(activeFile, { content: code, language });
      } catch (err) {
        if (String(err.message).includes('404') || String(err.message).toLowerCase().includes('not found')) {
          await api.createFile({ name: activeFile, language, content: code });
        } else {
          throw err;
        }
      }
      setDirty(false);
      await refreshFiles();
      showToast('Saved!');
    } catch (err) {
      showToast(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleCreate(name, lang) {
    try {
      await api.createFile({ name, language: lang, content: code });
      setActiveFile(name);
      setLanguage(lang);
      setDirty(false);
      setDialogOpen(false);
      await refreshFiles();
      showToast(`Created ${name}`);
    } catch (err) {
      showToast(`Create failed: ${err.message}`);
    }
  }

  async function handleDelete(name) {
    if (!window.confirm(`Delete ${name}?`)) return;
    try {
      await api.deleteFile(name);
      if (name === activeFile) {
        setActiveFile('');
        setCode(SAMPLE_CODE);
      }
      await refreshFiles();
      showToast(`Deleted ${name}`);
    } catch (err) {
      showToast(`Delete failed: ${err.message}`);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(code).then(
      () => showToast('Code copied!'),
      () => showToast('Copy failed')
    );
  }

  function handleDownload() {
    const fileName = activeFile || `main.${extensionFor(language)}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${fileName}`);
  }

  function handleReset() {
    setCode(SAMPLE_CODE);
    setLanguage('javascript');
    setDirty(false);
    showToast('Editor reset');
  }

  return (
    <div className={`app ${theme === 'light' ? 'light' : 'dark'}`}>
      <Header
        language={language}
        onLanguageChange={(l) => {
          setLanguage(l);
          setDirty(true);
        }}
        theme={theme}
        onThemeChange={setTheme}
        onSave={handleSave}
        onDownload={handleDownload}
        onCopy={handleCopy}
        onReset={handleReset}
        onNewFile={() => setDialogOpen(true)}
        saving={saving}
      />
      <div className="main">
        <Sidebar
          files={files}
          activeFile={activeFile}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onNewFile={() => setDialogOpen(true)}
          connected={connected}
        />
        <CodeEditor
          code={code}
          language={language}
          theme={theme}
          onChange={(v) => {
            setCode(v);
            setDirty(true);
          }}
          onCursorChange={setCursor}
        />
      </div>
      <StatusBar
        line={cursor.line}
        column={cursor.column}
        language={language}
        activeFile={activeFile}
        connected={connected}
        dirty={dirty}
      />
      <FileDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreate}
      />
      <Toast message={toast} />
    </div>
  );
}
