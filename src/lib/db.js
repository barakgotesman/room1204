// Extracts table names from a SQL string by matching FROM and JOIN clauses.
// Used by hint progression to track which tables the player has explored.
// e.g. "SELECT * FROM people JOIN hotel_guests" → ['people', 'hotel_guests']
export function extractTables(sql) {
  const matches = sql.toLowerCase().match(/(?:from|join)\s+(\w+)/g) || []
  return matches.map(m => m.replace(/(?:from|join)\s+/, '').trim())
}
