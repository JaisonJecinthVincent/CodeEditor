import { languageLabel } from '../data/sampleCode.js';

export default function Header({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onSave,
  onDownload,
  onCopy,
  onReset,
  onNewFile,
  saving
}) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand-logo">{'</>'}</span>
        <span className="brand-name">CodeLab2</span>
      </div>

      <div className="header-controls">
        <label className="control">
          <span>Language</span>
          <select value={language} onChange={(e) => onLanguageChange(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="sql">SQL</option>
          </select>
        </label>

        <label className="control">
          <span>Theme</span>
          <select value={theme} onChange={(e) => onThemeChange(e.target.value)}>
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </label>

        <button className="btn" onClick={onNewFile}>+ New</button>
        <button className="btn primary" onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className="btn" onClick={onCopy}>Copy</button>
        <button className="btn" onClick={onDownload}>Download</button>
        <button className="btn ghost" onClick={onReset}>Reset</button>
      </div>
    </header>
  );
}
