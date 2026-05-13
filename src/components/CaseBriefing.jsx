const OPENING = `Viktor Harmon, CEO of NovaPharma, was found dead in his hotel room at the Belvedere in Davos. Time of death: approximately 21:50.

The scene was clean. Too clean. No signs of forced entry. No struggle. The coroner flagged an unusual compound in the toxicology screen.

You have been granted access to the investigation database. One table to start:`

const STARTING_QUERY = `SELECT * FROM incident_reports LIMIT 5;`

export default function CaseBriefing({ onQueryClick, narrativeUpdates }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">001</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs tracking-widest uppercase text-text-dim">Incident</span>
        </div>
        <p className="font-body text-sm leading-relaxed text-text-dim whitespace-pre-line">
          {OPENING}
        </p>
        <button
          onClick={() => onQueryClick(STARTING_QUERY)}
          className="mt-3 font-mono text-xs text-accent border-b border-accent-dim hover:border-accent transition-colors pb-px"
        >
          → {STARTING_QUERY}
        </button>
      </div>

      {narrativeUpdates.length > 0 && (
        <div className="border-t border-border pt-4 flex flex-col gap-3">
          {narrativeUpdates.map((update, i) => (
            <div key={i} className="fade-in">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs tracking-widest uppercase text-accent">
                  {String(i + 2).padStart(3, '0')}
                </span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <p className="font-body text-sm leading-relaxed text-text-dim">{update}</p>
            </div>
          ))}
        </div>
      )}

      <div className="border-t border-border pt-4">
        <p className="font-mono text-xs tracking-widest uppercase text-muted mb-3">Persons of Interest</p>
        <div className="flex flex-col gap-1">
          {[
            ['Marcus Webb', 'CFO, NovaPharma'],
            ['Sofia Reyes', 'VP Strategy, NovaPharma'],
            ['Elena Marsh', 'Financial Times journalist'],
            ['James Chen', 'CEO, PharmaRival'],
          ].map(([name, role]) => (
            <div key={name} className="flex justify-between items-baseline py-1 border-b border-border-dim">
              <span className="font-display text-sm text-on-surface">{name}</span>
              <span className="font-mono text-xs text-text-dim">{role}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
