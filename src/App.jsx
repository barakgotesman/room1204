import { useState, useCallback } from 'react'
import { useDatabase } from './hooks/useDatabase'
import { useQueryHistory } from './hooks/useQueryHistory'
import { useHintProgression } from './hooks/useHintProgression'
import Layout from './layout/Layout'
import CaseBriefing from './components/CaseBriefing'
import SqlEditor from './components/SqlEditor'
import ResultsTable from './components/ResultsTable'
import QueryHistory from './components/QueryHistory'
import HintPanel from './components/HintPanel'
import TablesModal from './components/TablesModal'
import ExportModal from './components/ExportModal'
import SubmitAnswer from './components/SubmitAnswer'
import IntroScreen from './components/IntroScreen'

export default function App() {
  const { dbReady, dbError, runQuery } = useDatabase()
  const [introDone, setIntroDone] = useState(false)
  const { history, addToHistory, resetHistory } = useQueryHistory()
  const { trackTables, hintStage, narrativeUpdates } = useHintProgression()

  const [results, setResults] = useState(null)
  const [queryError, setQueryError] = useState(null)
  const [rerunQuery, setRerunQuery] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [showTables, setShowTables] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [solved, setSolved] = useState(false)
  const [startTime, setStartTime] = useState(null)
  // Mobile only: briefing panel is collapsed by default to give more space to the editor
  const [briefingOpen, setBriefingOpen] = useState(false)

  function handleRun(sql) {
    const { results: res, error } = runQuery(sql)
    setResults(res)
    setQueryError(error)
    trackTables(sql)
    addToHistory({ sql, rowCount: res?.[0]?.values?.length ?? null })
  }

  if (!introDone) return (
    <IntroScreen onEnter={() => { setIntroDone(true); setStartTime(Date.now()) }} dbReady={dbReady} />
  )

  if (dbError) return (
    <div className="flex items-center justify-center h-screen bg-bg">
      <div className="text-center">
        <p className="font-display text-2xl text-accent mb-2">Database Error</p>
        <p className="font-mono text-sm text-danger">{dbError}</p>
        <p className="font-mono text-xs text-text-dim mt-2">Run <code>npm run dev</code> — do not open as file://</p>
      </div>
    </div>
  )

  if (!dbReady) return (
    <div className="flex items-center justify-center h-screen bg-bg">
      <p className="font-mono text-xs tracking-widest uppercase text-accent animate-pulse">Accessing Database…</p>
    </div>
  )

  if (solved) {
    const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    const h = Math.floor(elapsed / 3600)
    const m = Math.floor((elapsed % 3600) / 60)
    const s = elapsed % 60
    const timeDisplay = h > 0
      ? `${h}h ${m}m ${s}s`
      : m > 0 ? `${m}m ${s}s` : `${s}s`

    return (
      <div className="flex items-center justify-center min-h-screen bg-bg px-8">
        <div id="grain" />
        <div className="max-w-lg text-center">
          <div className="font-mono text-xs tracking-widest uppercase text-accent mb-4">Case Closed</div>
          <h1 className="font-display text-4xl font-bold text-accent mb-6">Marcus Webb</h1>
          <div className="w-16 h-px bg-accent mx-auto mb-6" />
          <p className="font-body text-sm leading-relaxed text-text-dim mb-4">
            CFO of NovaPharma. He stole compound RH-7749 from the R&D lab on January 14th, entered room 1204 at 20:25 while Harmon was at the bar, and dissolved the neurotoxin in the minibar.
          </p>
          <p className="font-body text-sm leading-relaxed text-text-dim mb-4">
            Harmon returned at 21:18. He was dead by 21:50. Two days later, Webb closed a $4.2M short position in NovaPharma stock — before the board could announce Harmon's termination plans for him.
          </p>
          <p className="font-body text-sm leading-relaxed text-text-dim">
            The compound, the keycard, the trades. You found all three.
          </p>
          {startTime && (
            <div className="mt-6 font-mono text-xs text-success tracking-widest">
              Investigation completed in {timeDisplay}
            </div>
          )}
          <div className="mt-8 font-mono text-xs text-muted">— Room 1204 —</div>
          <button
            onClick={() => { setSolved(false); setStartTime(Date.now()); resetHistory() }}
            className="mt-6 font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-8 py-2.5 hover:border-accent hover:text-accent transition-colors"
          >
            Investigate Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div id="grain" />
      <Layout onHintClick={() => setShowHint(true)} onTablesClick={() => setShowTables(true)} onExportClick={() => setShowExport(true)} startTime={startTime} timerStopped={solved}>
        {/* On mobile: stacked vertically with collapsible briefing. On desktop: fixed sidebar + scrollable main. */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

          {/* Sidebar */}
          <div className="md:w-80 flex-shrink-0 flex flex-col md:border-r border-border bg-bg md:overflow-y-auto">

            {/* Mobile collapse toggle — hidden on desktop */}
            <button
              className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border text-left"
              onClick={() => setBriefingOpen(o => !o)}
            >
              <span className="font-mono text-xs tracking-widest uppercase text-accent">Case Briefing</span>
              <span className="font-mono text-xs text-text-dim">{briefingOpen ? '▲ collapse' : '▼ expand'}</span>
            </button>

            {/* Briefing — always visible on desktop, toggled on mobile */}
            <div className={`${briefingOpen ? 'block' : 'hidden'} md:block flex-1 overflow-y-auto`}>
              <div className="p-4 md:p-6">
                <CaseBriefing onQueryClick={(q) => { setRerunQuery(q); setBriefingOpen(false) }} narrativeUpdates={narrativeUpdates} />
              </div>
            </div>

            {/* Submit button — always visible regardless of collapse state */}
            <div className="p-4 md:p-6 border-t border-border">
              <SubmitAnswer onSolve={() => setSolved(true)} />
            </div>
          </div>

          {/* Main editor panel */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6">
              <SqlEditor onRun={handleRun} initialQuery={rerunQuery} />
              <ResultsTable results={results} error={queryError} />
              <QueryHistory history={history} onRerun={setRerunQuery} />
            </div>
          </div>
        </div>
      </Layout>

      {showHint && <HintPanel stage={hintStage} onClose={() => setShowHint(false)} />}
      {showTables && <TablesModal onClose={() => setShowTables(false)} onQuery={q => { setRerunQuery(q); setShowTables(false) }} />}
      {showExport && <ExportModal history={history} startTime={startTime} solved={solved} onClose={() => setShowExport(false)} />}
    </>
  )
}
