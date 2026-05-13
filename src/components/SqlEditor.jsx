import { useState, useEffect } from 'react'

export default function SqlEditor({ onRun, initialQuery }) {
  const [sql, setSql] = useState('SELECT * FROM incident_reports LIMIT 10;')

  useEffect(() => {
    if (initialQuery) setSql(initialQuery)
  }, [initialQuery])

  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = e.target
      const next = sql.slice(0, selectionStart) + '  ' + sql.slice(selectionEnd)
      setSql(next)
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2
      })
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onRun(sql)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-widest uppercase text-accent">Query</span>
        <div className="flex-1 h-px bg-border" />
        <span className="font-mono text-xs text-text-dim">Ctrl+Enter to run</span>
      </div>
      <textarea
        value={sql}
        onChange={e => setSql(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={6}
        spellCheck={false}
        className="w-full p-4 font-mono text-sm text-gray-200 bg-code-bg border border-border resize-none focus:border-accent transition-colors"
        style={{ lineHeight: '1.6' }}
      />
      <button
        onClick={() => onRun(sql)}
        className="self-start font-mono text-xs tracking-widest uppercase bg-accent text-bg px-6 py-2 hover:bg-accent-bright transition-colors font-medium"
      >
        ▶ Run Query
      </button>
    </div>
  )
}
