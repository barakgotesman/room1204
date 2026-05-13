import { useState, useRef, useEffect, useCallback } from 'react'
import initSqlJs from 'sql.js'

export function useDatabase() {
  const dbRef = useRef(null)
  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState(null)

  useEffect(() => {
    async function init() {
      try {
        const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
        const response = await fetch('./davos_affair.db')
        if (!response.ok) throw new Error('Database not found')
        const buffer = await response.arrayBuffer()
        dbRef.current = new SQL.Database(new Uint8Array(buffer))
        setDbReady(true)
      } catch (err) {
        setDbError(err.message)
      }
    }
    init()
  }, [])

  const runQuery = useCallback((sql) => {
    if (!dbRef.current) return { results: null, error: 'Database not ready' }
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      return { results: null, error: 'Only SELECT queries are permitted.' }
    }
    try {
      const results = dbRef.current.exec(sql)
      return { results, error: null }
    } catch (err) {
      return { results: null, error: err.message }
    }
  }, [])

  return { dbReady, dbError, runQuery }
}
