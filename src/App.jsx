import { useState } from 'react'
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
import SubmitAnswer from './components/SubmitAnswer'

export default function App() {
  const { dbReady, dbError, runQuery } = useDatabase()
  const { history, addToHistory } = useQueryHistory()
  const { trackTables, hintStage, narrativeUpdates } = useHintProgression()

  const [results, setResults] = useState(null)
  const [queryError, setQueryError] = useState(null)
  const [rerunQuery, setRerunQuery] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [showTables, setShowTables] = useState(false)
  const [solved, setSolved] = useState(false)

  function handleRun(sql) {
    const { results: res, error } = runQuery(sql)
    setResults(res)
    setQueryError(error)
    trackTables(sql)
    addToHistory({ sql, rowCount: res?.[0]?.values?.length ?? null })
  }

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

  if (solved) return (
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
        <div className="mt-8 font-mono text-xs text-muted">— The Davos Affair —</div>
      </div>
    </div>
  )

  return (
    <>
      <div id="grain" />
      <Layout onHintClick={() => setShowHint(true)} onTablesClick={() => setShowTables(true)}>
        <div className="w-80 flex-shrink-0 flex flex-col border-r border-border overflow-y-auto bg-bg">
          <div className="p-6 flex-1">
            <CaseBriefing onQueryClick={setRerunQuery} narrativeUpdates={narrativeUpdates} />
          </div>
          <div className="p-6 border-t border-border">
            <SubmitAnswer onSolve={() => setSolved(true)} />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            <SqlEditor onRun={handleRun} initialQuery={rerunQuery} />
            <ResultsTable results={results} error={queryError} />
            <QueryHistory history={history} onRerun={setRerunQuery} />
          </div>
        </div>
      </Layout>

      {showHint && <HintPanel stage={hintStage} onClose={() => setShowHint(false)} />}
      {showTables && <TablesModal onClose={() => setShowTables(false)} onQuery={q => { setRerunQuery(q); setShowTables(false) }} />}
    </>
  )
}
