import { useState } from 'react';

export default function FileDialog({ open, onClose, onCreate }) {
  const [name, setName] = useState('example.py');
  const [language, setLanguage] = useState('python');

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(name.trim(), language);
    setName('example.py');
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <form className="dialog" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h3>New file</h3>
        <label>
          File name:
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="example.py" />
        </label>
        <label>
          Language:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
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
        <div className="dialog-actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">Create</button>
        </div>
      </form>
    </div>
  );
}
