import { useState, useRef, useEffect, useCallback } from 'react'
import initSqlJs from 'sql.js'

export function useDatabase() {
  // useRef instead of useState — the db instance is mutable and not serializable,
  // so storing it in state would cause unnecessary re-renders on every query.
  const dbRef = useRef(null)
  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState(null)

  useEffect(() => {
    async function init() {
      try {
        // sql.js needs its WASM binary served statically — locateFile points to /sql-wasm.wasm in public/
        const SQL = await initSqlJs({ locateFile: () => '/sql-wasm.wasm' })
        const response = await fetch('./davos_affair.db')
        if (!response.ok) throw new Error('Database not found')
        const buffer = await response.arrayBuffer()
        // Load the entire .db file into memory as a Uint8Array — sql.js operates fully in-browser
        dbRef.current = new SQL.Database(new Uint8Array(buffer))
        window._db = dbRef.current  // dev helper: run queries from browser console
        setDbReady(true)
      } catch (err) {
        setDbError(err.message)
      }
    }
    init()
  }, [])

  const runQuery = useCallback((sql) => {
    if (!dbRef.current) return { results: null, error: 'Database not ready' }

    // Restrict to SELECT-only to prevent players from mutating the in-memory DB
    if (!sql.trim().toUpperCase().startsWith('SELECT')) {
      return { results: null, error: 'Only SELECT queries are permitted.' }
    }
    try {
      // db.exec returns [] for queries with no rows — never null
      const results = dbRef.current.exec(sql)
      return { results, error: null }
    } catch (err) {
      // Invalid SQL throws — caught here and surfaced as a user-facing error
      return { results: null, error: err.message }
    }
  }, [])

  return { dbReady, dbError, runQuery }
}
