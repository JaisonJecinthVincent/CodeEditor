import { languageLabel } from '../data/sampleCode.js';

export default function StatusBar({ line, column, language, activeFile, connected, dirty }) {
  return (
    <footer className="statusbar">
      <span>Ln {line}, Col {column}</span>
      <span>{languageLabel(language)}</span>
      <span>UTF-8</span>
      <span className={connected ? 'ok' : 'bad'}>{connected ? 'Connected' : 'Offline'}</span>
      <span>{dirty ? '● Unsaved' : 'Ready'}</span>
      {activeFile && <span className="active-file">{activeFile}</span>}
    </footer>
  );
}
