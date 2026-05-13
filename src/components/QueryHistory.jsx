export default function QueryHistory({ history, onRerun }) {
  if (history.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xs tracking-widest uppercase text-muted">History</span>
        <div className="flex-1 h-px bg-border-dim" />
      </div>
      <div className="flex flex-col gap-1">
        {history.slice().reverse().map((item, i) => (
          <button
            key={i}
            onClick={() => onRerun(item.sql)}
            className="text-left px-3 py-2 border border-border-dim hover:border-border bg-bg hover:bg-surface-low transition-colors group"
          >
            <div className="font-mono text-xs text-text-dim truncate group-hover:text-accent transition-colors">
              {item.sql}
            </div>
            <div className="font-mono text-xs text-muted mt-0.5">
              {item.rowCount !== null ? `${item.rowCount} rows` : 'error'} · {item.time}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
