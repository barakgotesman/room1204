import { useState, useCallback } from 'react'

export function useQueryHistory() {
  const [history, setHistory] = useState([])

  const addToHistory = useCallback(({ sql, rowCount }) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setHistory(prev => [...prev.slice(-9), { sql: sql.trim(), rowCount, time }])
  }, [])

  return { history, addToHistory }
}
