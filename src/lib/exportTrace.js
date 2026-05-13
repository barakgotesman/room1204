// Builds a plain-text investigation report from the player's query history.
// Output is suitable for copying to clipboard or downloading as a .txt file.
export function buildTraceText(history, startTime, solved) {
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // Convert startTime (epoch ms) to a human-readable duration string
  const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
  const h = Math.floor(elapsed / 3600)
  const m = Math.floor((elapsed % 3600) / 60)
  const s = elapsed % 60
  const timeStr = h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`

  const divider = '═'.repeat(39)

  // Build the header block — omit "Time elapsed" if game hasn't started yet
  const lines = [
    'ROOM 1204 — Investigation Report',
    divider,
    `Date:          ${dateStr}`,
    startTime ? `Time elapsed:  ${timeStr}` : null,
    `Queries run:   ${history.length}`,
    `Case status:   ${solved ? 'SOLVED — Marcus Webb' : 'Unsolved'}`,
    divider,
    '',
  ].filter(l => l !== null)

  // Each history entry: index + timestamp, the SQL, and the row count result
  history.forEach((item, i) => {
    // rowCount is null when the query threw an error
    const rowInfo = item.rowCount === null ? '→ error' : `→ ${item.rowCount} row${item.rowCount !== 1 ? 's' : ''}`
    lines.push(`[${i + 1}] ${item.time}`)
    lines.push(item.sql)
    lines.push(rowInfo)
    lines.push('')
  })

  if (history.length === 0) {
    lines.push('No queries recorded.')
    lines.push('')
  }

  lines.push(divider)
  lines.push('room1204.vercel.app')

  return lines.join('\n')
}
