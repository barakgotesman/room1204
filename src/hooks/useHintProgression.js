import { useState, useCallback } from 'react'
import { extractTables } from '../lib/db'
import { getHintStage, getNarrativeUpdates } from '../lib/hints'

export function useHintProgression() {
  // Accumulates every table the player has queried across the session.
  // A Set is used so duplicates are ignored automatically.
  const [queriedTables, setQueriedTables] = useState(new Set())

  // Called after every query run — merges newly discovered tables into the Set.
  const trackTables = useCallback((sql) => {
    const tables = extractTables(sql)
    setQueriedTables(prev => new Set([...prev, ...tables]))
  }, [])

  // hintStage and narrativeUpdates are derived synchronously from the Set —
  // no need for extra state, they recompute whenever queriedTables changes.
  const hintStage = getHintStage(queriedTables)
  const narrativeUpdates = getNarrativeUpdates(queriedTables)

  return { trackTables, hintStage, narrativeUpdates }
}
