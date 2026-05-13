export function extractTables(sql) {
  const matches = sql.toLowerCase().match(/(?:from|join)\s+(\w+)/g) || []
  return matches.map(m => m.replace(/(?:from|join)\s+/, '').trim())
}
