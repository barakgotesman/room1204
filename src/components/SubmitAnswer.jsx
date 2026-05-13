import { useState } from 'react'
import { checkAnswer } from '../lib/game'

export default function SubmitAnswer({ onSolve }) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [wrong, setWrong] = useState(false)

  function handleSubmit() {
    if (checkAnswer(input)) {
      onSolve()
    } else {
      setWrong(true)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full font-mono text-xs tracking-widest uppercase border border-accent text-accent px-4 py-3 hover:bg-accent hover:text-bg transition-colors"
      >
        Submit Accusation
      </button>

      {/* Expands upward as an overlay so it never affects sidebar height */}
      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 border border-border bg-surface p-4 flex flex-col gap-3 z-10">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs tracking-widest uppercase text-accent">Accusation</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <input
            autoFocus
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setWrong(false) }}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="Name the murderer…"
            className="w-full px-3 py-2 bg-code-bg border border-border font-mono text-sm text-gray-200 focus:border-accent transition-colors"
          />
          {wrong && (
            <p className="font-mono text-xs text-danger">Insufficient evidence. Keep investigating.</p>
          )}
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="font-mono text-xs tracking-widest uppercase bg-accent text-bg px-5 py-2 hover:bg-accent-bright transition-colors">
              Charge
            </button>
            <button onClick={() => { setOpen(false); setWrong(false) }} className="font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
