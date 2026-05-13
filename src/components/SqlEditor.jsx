import { useState, useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-sql'

// Noir-themed token colors injected once into <head>
const PRISM_STYLE = `
.sql-highlight .token.keyword    { color: #c8a96e; font-weight: bold; }
.sql-highlight .token.function   { color: #e0c97a; }
.sql-highlight .token.string     { color: #7ec8a0; }
.sql-highlight .token.number     { color: #a0c8e0; }
.sql-highlight .token.operator   { color: #b0b0c8; }
.sql-highlight .token.punctuation{ color: #6b6b80; }
.sql-highlight .token.comment    { color: #4a4a5a; font-style: italic; }
`

// Shared inline style applied to both the <pre> backdrop and the <textarea> overlay —
// they must be pixel-identical so the highlight lines up with the cursor.
const EDITOR_STYLE = {
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.875rem',
  lineHeight: '1.6',
  padding: '16px',
  margin: 0,
  border: 'none',
  outline: 'none',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-all',
  tabSize: 2,
  minHeight: '9.6rem',
  width: '100%',
  boxSizing: 'border-box',
}

// Module-level flag — only inject the <style> tag once even across remounts
let styleInjected = false

/**
 * SqlEditor — syntax-highlighted SQL editor using a transparent textarea
 * over a Prism-highlighted <pre> backdrop (no editor library required).
 *
 * Props:
 *   onRun(sql: string)   — fires when the user runs a query
 *   initialQuery: string — pre-fills the editor on mount
 */
export default function SqlEditor({ onRun, initialQuery }) {
  const [sql, setSql] = useState('SELECT * FROM incident_reports LIMIT 10;')
  // Ref to sync backdrop scroll position with the textarea scroll
  const preRef = useRef(null)
  const taRef = useRef(null)

  // Inject Prism token CSS once
  useEffect(() => {
    if (!styleInjected) {
      const tag = document.createElement('style')
      tag.textContent = PRISM_STYLE
      document.head.appendChild(tag)
      styleInjected = true
    }
  }, [])

  // Sync editor when a pre-built query is injected from outside
  useEffect(() => {
    if (initialQuery) setSql(initialQuery)
  }, [initialQuery])

  // Keep the backdrop <pre> scrolled in sync with the textarea
  function syncScroll() {
    if (preRef.current && taRef.current) {
      preRef.current.scrollTop = taRef.current.scrollTop
      preRef.current.scrollLeft = taRef.current.scrollLeft
    }
  }

  // Tab → insert 2 spaces; Ctrl/Cmd+Enter → run query
  function handleKeyDown(e) {
    if (e.key === 'Tab') {
      e.preventDefault()
      const { selectionStart, selectionEnd } = e.target
      const next = sql.slice(0, selectionStart) + '  ' + sql.slice(selectionEnd)
      setSql(next)
      // Restore cursor after the inserted spaces on the next frame
      requestAnimationFrame(() => {
        e.target.selectionStart = e.target.selectionEnd = selectionStart + 2
      })
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      onRun(sql)
    }
  }

  // Prism.highlight returns an HTML string of <span> tokens
  const highlighted = Prism.highlight(sql, Prism.languages.sql, 'sql')

  return (
    <div className="flex flex-col gap-3">
      {/* Section label row */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tracking-widest uppercase text-accent">Query</span>
        <div className="flex-1 h-px bg-border" />
        <span className="font-mono text-xs text-text-dim">Ctrl+Enter to run</span>
      </div>

      {/* Editor container: relative so the pre and textarea stack on top of each other */}
      <div
        className="relative border border-border focus-within:border-accent transition-colors overflow-hidden"
        style={{ background: '#0d1117' }}
      >
        {/* Backdrop <pre>: renders the Prism-highlighted HTML behind the textarea */}
        <pre
          ref={preRef}
          aria-hidden="true"
          className="sql-highlight"
          style={{
            ...EDITOR_STYLE,
            position: 'absolute',
            top: 0,
            left: 0,
            pointerEvents: 'none',   // clicks pass through to the textarea
            overflow: 'hidden',
            color: '#e2e8f0',
            background: 'transparent',
          }}
          dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
        />

        {/* Transparent textarea sits on top — user types here */}
        <textarea
          ref={taRef}
          value={sql}
          onChange={e => setSql(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          style={{
            ...EDITOR_STYLE,
            position: 'relative',
            display: 'block',
            background: 'transparent',
            color: 'transparent',        // hide the native text; the <pre> shows it
            caretColor: '#c8a96e',       // gold cursor so the user can see where they are
            resize: 'none',
            overflow: 'auto',
          }}
        />
      </div>

      {/* Run button */}
      <button
        onClick={() => onRun(sql)}
        className="self-start font-mono text-xs tracking-widest uppercase bg-accent text-bg px-6 py-2 hover:bg-accent-bright transition-colors font-medium"
      >
        ▶ Run Query
      </button>
    </div>
  )
}
