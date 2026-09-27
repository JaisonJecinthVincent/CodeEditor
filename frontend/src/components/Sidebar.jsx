export default function Sidebar({ files, activeFile, onSelect, onDelete, onNewFile, connected }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <span>EXPLORER</span>
        <button className="icon-btn" title="New file" onClick={onNewFile}>+</button>
      </div>
      <div className="workspace-label">📁 workspace {!connected && '(offline)'}</div>
      <ul className="file-list">
        {files.length === 0 && <li className="empty">No files yet — create one.</li>}
        {files.map((f) => (
          <li
            key={f.name}
            className={f.name === activeFile ? 'file-item active' : 'file-item'}
            onClick={() => onSelect(f.name)}
          >
            <span className="file-name">📄 {f.name}</span>
            <button
              className="delete-btn"
              title={`Delete ${f.name}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(f.name);
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
