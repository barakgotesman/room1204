export default function ResultsTable({ results, error, loading }) {
  if (loading) {
    return (
      <div className="font-mono text-xs text-text-dim p-4 border border-border bg-surface">
        Executing query…
      </div>
    )
  }

  if (error) {
    return (
      <div className="font-mono text-xs text-danger p-4 border border-danger-bg bg-surface fade-in">
        <span className="text-muted mr-2">ERROR</span>{error}
      </div>
    )
  }

  if (!results) return null

  if (results.length === 0) {
    return (
      <div className="font-mono text-xs text-text-dim p-4 border border-border bg-surface fade-in">
        Query returned 0 rows.
      </div>
    )
  }

  const { columns, values } = results[0]

  return (
    <div className="overflow-x-auto border border-border fade-in">
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr className="bg-surface-high">
            {columns.map(col => (
              <th
                key={col}
                className="text-left px-3 py-2 text-accent tracking-widest uppercase border-b border-border whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {values.map((row, i) => (
            <tr key={i} className="border-b border-border-dim hover:bg-surface-low transition-colors">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="px-3 py-2 text-text-dim whitespace-nowrap max-w-xs truncate"
                  title={cell === null ? 'null' : String(cell)}
                >
                  {cell === null ? <span className="text-muted italic">null</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-3 py-2 bg-surface border-t border-border">
        <span className="font-mono text-xs text-muted">{values.length} row{values.length !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
