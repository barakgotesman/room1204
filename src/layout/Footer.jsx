import { useEffect, useState } from 'react'
import { IconCheck } from '../components/Icons'

export default function Footer({ startTime, stopped }) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime || stopped) return
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000)
    return () => clearInterval(id)
  }, [startTime, stopped])

  useEffect(() => {
    if (stopped) setElapsed(Math.floor((Date.now() - startTime) / 1000))
  }, [stopped])

  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  const display = h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return (
    <footer className="border-t border-border px-4 md:px-8 py-3 flex items-center justify-between bg-bg flex-shrink-0 gap-2">
      <span className="font-mono text-xs text-muted tracking-widest uppercase hidden md:block">
        Davos, Switzerland — January 2024
      </span>
      <span className="font-mono text-xs text-text-dim tracking-widest uppercase opacity-40 hidden md:block">
        A SQL mystery game &nbsp;·&nbsp; SQLite syntax
      </span>
      {/* On mobile only show the timer / fallback label */}
      <span className="font-mono text-xs text-text-dim tracking-widest uppercase opacity-40 md:hidden">
        SQLite
      </span>
      {startTime ? (
        <span className={`flex items-center gap-1 font-mono text-xs tracking-widest ${stopped ? 'text-success' : 'text-text-dim'}`}>
          {stopped && <IconCheck size={12} />}{display}
        </span>
      ) : (
        <span className="font-mono text-xs text-border tracking-widest uppercase">Room 1204</span>
      )}
    </footer>
  )
}
