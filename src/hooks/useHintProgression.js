import { useState, useCallback } from 'react'
import { extractTables } from '../lib/db'
import { getHintStage, getNarrativeUpdates } from '../lib/hints'

export function useHintProgression() {
  const [queriedTables, setQueriedTables] = useState(new Set())

  const trackTables = useCallback((sql) => {
    const tables = extractTables(sql)
    setQueriedTables(prev => new Set([...prev, ...tables]))
  }, [])

  const hintStage = getHintStage(queriedTables)
  const narrativeUpdates = getNarrativeUpdates(queriedTables)

  return { trackTables, hintStage, narrativeUpdates }
}
