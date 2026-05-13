const TABLES = [
  ['people', 'All characters — name, occupation, employer, nationality'],
  ['companies', 'NovaPharma, PharmaRival'],
  ['incident_reports', 'Scene timeline — the starting point'],
  ['coroner_reports', 'TOD, toxicology, compound name'],
  ['hotel_guests', 'Who stayed at Hotel Belvedere and when'],
  ['hotel_key_access', 'Every room entry/exit by keycard'],
  ['travel_records', 'Trains and flights for each person'],
  ['flights', 'Flight data'],
  ['boarding_passes', 'Confirms flight alibi'],
  ['phone_calls', 'Call time, city, duration'],
  ['emails', 'Subject lines — includes one deleted (deleted=1)'],
  ['transactions', 'Financial transfers'],
  ['stock_trades', 'Stock sale records'],
  ['company_decisions', 'Board/company events'],
  ['meetings', 'Meeting records'],
  ['meeting_attendees', 'Who attended each meeting'],
  ['board_decisions', 'Board-level decisions'],
  ['lab_access_logs', 'Who accessed the R&D lab'],
  ['drug_inventory', 'Compound quantities before/after'],
  ['research_clearance', 'Clearance levels for compounds'],
  ['restaurant_receipts', 'Dinner receipts'],
  ['social_media_posts', 'Public posts and location tags'],
  ['contracts', 'Active contracts'],
]

export default function TablesModal({ onClose, onQuery }) {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface border border-border p-6 max-w-lg w-full mx-4 max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">Database</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted">23 tables</span>
        </div>
        <div className="overflow-y-auto flex-1">
          {TABLES.map(([name, desc]) => (
            <button
              key={name}
              onClick={() => { onQuery(`SELECT * FROM ${name} LIMIT 20;`); onClose() }}
              className="w-full text-left px-3 py-2 border-b border-border-dim hover:bg-surface-low group transition-colors"
            >
              <div className="font-mono text-xs text-accent group-hover:text-accent-bright">{name}</div>
              <div className="font-body text-xs text-text-dim mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors self-start">
          Close
        </button>
      </div>
    </div>
  )
}
