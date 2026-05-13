import { useState, useEffect, useRef } from 'react'

// Lines typed out one by one, each on its own row
const LINES = [
  { text: 'DAVOS, SWITZERLAND — JANUARY 17, 2024', type: 'label' },
  { text: '', type: 'gap' },
  { text: 'Viktor Harmon, CEO of NovaPharma, was found dead', type: 'body' },
  { text: 'in his hotel room at the Belvedere. Room 1204.', type: 'body' },
  { text: 'Time of death: approximately 21:50.', type: 'body' },
  { text: '', type: 'gap' },
  { text: 'The scene was clean. Too clean.', type: 'body' },
  { text: 'No signs of forced entry. No struggle.', type: 'body' },
  { text: 'The coroner flagged an unusual compound', type: 'body' },
  { text: 'in the toxicology screen.', type: 'body' },
  { text: '', type: 'gap' },
  { text: 'You have been granted access to the investigation database.', type: 'body' },
  { text: '', type: 'gap' },
  { text: 'Find the killer.', type: 'accent' },
]

// ms per character — slower for labels, faster for body
const SPEED = { label: 55, body: 28, accent: 60, gap: 0 }
// pause after each full line is typed before starting the next
const LINE_PAUSE = 180

export default function IntroScreen({ onEnter, dbReady }) {
  const [visibleLines, setVisibleLines] = useState([])   // fully typed lines
  const [currentText, setCurrentText] = useState('')     // line currently being typed
  const [lineIndex, setLineIndex] = useState(0)          // which line we're on
  const [charIndex, setCharIndex] = useState(0)          // char position within line
  const [done, setDone] = useState(false)                // all lines finished
  const [exiting, setExiting] = useState(false)          // fade-out started
  const timerRef = useRef(null)

  // Typewriter engine — re-runs every time lineIndex or charIndex advances.
  // Each tick schedules exactly one setTimeout, which in turn increments the
  // relevant counter and triggers the next tick via the dependency array.
  useEffect(() => {
    if (lineIndex >= LINES.length) {
      setDone(true)
      return
    }

    const line = LINES[lineIndex]

    // Gap lines have no text — just pause then move on
    if (line.type === 'gap') {
      timerRef.current = setTimeout(() => {
        setVisibleLines(prev => [...prev, { ...line, text: '' }])
        setLineIndex(i => i + 1)
        setCharIndex(0)
        setCurrentText('')
      }, LINE_PAUSE)
      return
    }

    // Still typing the current line — reveal one more character per tick
    if (charIndex < line.text.length) {
      timerRef.current = setTimeout(() => {
        setCurrentText(line.text.slice(0, charIndex + 1))
        setCharIndex(c => c + 1)
      }, SPEED[line.type])
      return
    }

    // Line fully typed — pause at LINE_PAUSE, then commit it to visibleLines and advance
    timerRef.current = setTimeout(() => {
      setVisibleLines(prev => [...prev, line])
      setCurrentText('')
      setCharIndex(0)
      setLineIndex(i => i + 1)
    }, LINE_PAUSE)

    return () => clearTimeout(timerRef.current)
  }, [lineIndex, charIndex])

  // Clean up on unmount
  useEffect(() => () => clearTimeout(timerRef.current), [])

  function handleEnter() {
    setExiting(true)
    setTimeout(onEnter, 600)
  }

  // Skip to end instantly on click before typing finishes
  function handleSkip() {
    clearTimeout(timerRef.current)
    setVisibleLines(LINES)
    setCurrentText('')
    setLineIndex(LINES.length)
    setDone(true)
  }

  return (
    <div
      className={`fixed inset-0 bg-bg flex flex-col items-center justify-center z-50 transition-opacity duration-600 ${exiting ? 'opacity-0' : 'opacity-100'}`}
      style={{ transition: 'opacity 0.6s ease' }}
      onClick={!done ? handleSkip : undefined}
    >
      {/* Grain overlay */}
      <div id="grain" />

      {/* Top label */}
      <div className="absolute top-8 left-0 right-0 flex justify-center">
        <span className="font-mono text-xs tracking-widest uppercase text-text-dim opacity-40">
          Room 1204 — Classified Access
        </span>
      </div>

      {/* Davos image */}
      <div className="max-w-xl w-full px-8 mb-8">
        <div className="relative w-full h-48 overflow-hidden" style={{ borderBottom: '1px solid #1e1e2e' }}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80"
            alt="Davos, Switzerland"
            className="w-full h-full object-cover object-center opacity-60"
            style={{ filter: 'grayscale(60%) contrast(1.1)' }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, #0a0a0f 100%)' }} />
          <span className="absolute bottom-2 right-3 font-mono text-xs text-text-dim opacity-40 tracking-widest uppercase">
            Davos, Switzerland
          </span>
        </div>
      </div>

      {/* Typed text block */}
      <div className="max-w-xl w-full px-8">
        {visibleLines.map((line, i) => (
          <div key={i} className="min-h-[1.6rem]">
            {line.type === 'label' && (
              <p className="font-mono text-xs tracking-widest uppercase text-accent mb-1">{line.text}</p>
            )}
            {line.type === 'body' && (
              <p className="font-body text-base leading-relaxed text-text-dim">{line.text}</p>
            )}
            {line.type === 'accent' && (
              <p className="font-display text-xl text-accent mt-2">{line.text}</p>
            )}
            {line.type === 'gap' && <div className="h-4" />}
          </div>
        ))}

        {/* Currently typing line */}
        {lineIndex < LINES.length && currentText !== '' && (
          <div className="min-h-[1.6rem]">
            {LINES[lineIndex].type === 'label' && (
              <p className="font-mono text-xs tracking-widest uppercase text-accent mb-1">
                {currentText}<span className="animate-pulse">▋</span>
              </p>
            )}
            {LINES[lineIndex].type === 'body' && (
              <p className="font-body text-base leading-relaxed text-text-dim">
                {currentText}<span className="animate-pulse">▋</span>
              </p>
            )}
            {LINES[lineIndex].type === 'accent' && (
              <p className="font-display text-xl text-accent mt-2">
                {currentText}<span className="animate-pulse">▋</span>
              </p>
            )}
          </div>
        )}

        {/* Blinking cursor while still typing */}
        {!done && lineIndex < LINES.length && currentText === '' && (
          <span className="font-mono text-accent animate-pulse">▋</span>
        )}
      </div>

      {/* CTA — only shown when typing is done and DB is ready */}
      {done && (
        <div className="mt-12 flex flex-col items-center gap-3" style={{ animation: 'fadeIn 0.8s ease forwards' }}>
          <button
            onClick={handleEnter}
            disabled={!dbReady}
            className="font-mono text-xs tracking-widest uppercase border border-accent text-accent px-10 py-3 hover:bg-accent hover:text-bg transition-colors disabled:opacity-40 disabled:cursor-wait"
          >
            {dbReady ? 'Begin Investigation' : 'Accessing Database…'}
          </button>
          {!dbReady && (
            <span className="font-mono text-xs text-text-dim animate-pulse">Loading evidence…</span>
          )}
        </div>
      )}

      {/* Skip hint */}
      {!done && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <span className="font-mono text-xs text-text-dim opacity-30">click anywhere to skip</span>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
