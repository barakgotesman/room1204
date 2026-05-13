import { useState } from 'react'
import { buildTraceText } from '../lib/exportTrace'
import { IconCheck, IconExport } from './Icons'

export default function ExportModal({ history, startTime, solved, onClose }) {
  const [copied, setCopied] = useState(false)
  const text = buildTraceText(history, startTime, solved)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleDownload() {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'room1204-investigation.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface border border-border p-4 md:p-6 mx-3 md:mx-4 w-full md:w-[42rem] flex flex-col"
        style={{ maxHeight: '85vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">Investigation Report</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted">{history.length} queries</span>
        </div>

        <pre className="flex-1 overflow-auto font-mono text-xs text-text-dim bg-code-bg border border-border p-4 leading-relaxed whitespace-pre" style={{ maxHeight: '55vh' }}>
          {text}
        </pre>

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-6 py-2 border transition-colors ${
              copied
                ? 'border-success text-success'
                : 'border-accent text-accent hover:bg-accent hover:text-bg'
            }`}
          >
            <IconCheck size={12} className={copied ? '' : 'opacity-0 w-0'} />
          {copied ? 'Copied' : 'Copy to Clipboard'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase px-6 py-2 border border-border text-text-dim hover:border-accent hover:text-accent transition-colors"
          >
            <IconExport size={12} /> Download .txt
          </button>
          <button
            onClick={onClose}
            className="ml-auto font-mono text-xs tracking-widest uppercase px-4 py-2 border border-border text-text-dim hover:border-accent hover:text-accent transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
