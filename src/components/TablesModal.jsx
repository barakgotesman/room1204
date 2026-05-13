import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

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

const ERD_GROUPS = [
  {
    label: 'Core',
    diagram: `erDiagram
  people {
    int id PK
    string name
    string occupation
    string employer
    string nationality
  }
  companies {
    int id PK
    string name
    string industry
  }
  contracts {
    int id PK
    int person_id FK
    int company_id FK
    string value
    string signed_date
  }
  people ||--o{ contracts : "signs"
  companies ||--o{ contracts : "party to"
`,
  },
  {
    label: 'Hotel & Access',
    diagram: `erDiagram
  people {
    int id PK
    string name
  }
  incident_reports {
    int id PK
    string event
    string time
    string location
    string reported_by
  }
  coroner_reports {
    int id PK
    string time_of_death
    string toxicology_flag
    string compound_name
  }
  hotel_guests {
    int id PK
    int person_id FK
    string room
    string check_in
    string check_out
  }
  hotel_key_access {
    int id PK
    int person_id FK
    string room
    string timestamp
    string action
  }
  people ||--o{ hotel_guests : "stays"
  people ||--o{ hotel_key_access : "accesses"
`,
  },
  {
    label: 'Travel & Comms',
    diagram: `erDiagram
  people {
    int id PK
    string name
  }
  travel_records {
    int id PK
    int person_id FK
    string type
    string origin
    string destination
    string departure
  }
  flights {
    int id PK
    string flight_number
    string origin
    string destination
    string departure
  }
  boarding_passes {
    int id PK
    int person_id FK
    int flight_id FK
    string seat
  }
  phone_calls {
    int id PK
    int person_id FK
    string call_time
    string city
    int duration_sec
  }
  emails {
    int id PK
    int sender_id FK
    int recipient_id FK
    string subject
    string sent_at
    int deleted
  }
  people ||--o{ travel_records : "travels"
  people ||--o{ boarding_passes : "boards"
  people ||--o{ phone_calls : "calls"
  people ||--o{ emails : "sends"
  flights ||--o{ boarding_passes : "has"
`,
  },
  {
    label: 'Financial',
    diagram: `erDiagram
  people {
    int id PK
    string name
  }
  companies {
    int id PK
    string name
  }
  transactions {
    int id PK
    int person_id FK
    string date
    float amount
    string destination
  }
  stock_trades {
    int id PK
    int person_id FK
    string trade_date
    string ticker
    string action
    int shares
  }
  company_decisions {
    int id PK
    int company_id FK
    string decision_date
    string description
  }
  board_decisions {
    int id PK
    int company_id FK
    string decision_date
    string subject
    string outcome
  }
  people ||--o{ transactions : "transfers"
  people ||--o{ stock_trades : "trades"
  companies ||--o{ company_decisions : "decides"
  companies ||--o{ board_decisions : "governs"
`,
  },
  {
    label: 'Lab & Research',
    diagram: `erDiagram
  people {
    int id PK
    string name
  }
  lab_access_logs {
    int id PK
    int person_id FK
    string access_time
    string lab_section
  }
  drug_inventory {
    int id PK
    string compound
    int quantity_before
    int quantity_after
    string audit_date
  }
  research_clearance {
    int id PK
    int person_id FK
    string compound
    int clearance_level
  }
  people ||--o{ lab_access_logs : "accesses"
  people ||--o{ research_clearance : "cleared for"
`,
  },
  {
    label: 'Social & Meetings',
    diagram: `erDiagram
  people {
    int id PK
    string name
  }
  meetings {
    int id PK
    string title
    string meeting_date
    string location
  }
  meeting_attendees {
    int id PK
    int meeting_id FK
    int person_id FK
  }
  restaurant_receipts {
    int id PK
    int person_id FK
    string date
    int covers
    string restaurant
  }
  social_media_posts {
    int id PK
    int person_id FK
    string posted_at
    string location_tag
    string content
  }
  people ||--o{ meeting_attendees : "attends"
  people ||--o{ restaurant_receipts : "dines"
  people ||--o{ social_media_posts : "posts"
  meetings ||--o{ meeting_attendees : "includes"
`,
  },
]

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#111118',
    primaryTextColor: '#c8a96e',
    primaryBorderColor: '#1e1e2e',
    lineColor: '#7a6540',
    secondaryColor: '#0a0a0f',
    background: '#0a0a0f',
    mainBkg: '#111118',
    nodeBorder: '#1e1e2e',
    titleColor: '#c8a96e',
    attributeBackgroundColorEven: '#0d1117',
    attributeBackgroundColorOdd: '#111118',
  },
  er: { diagramPadding: 30, layoutDirection: 'TB', minEntityWidth: 120 },
})

let renderCounter = 0

function ErdGroup({ diagram }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    let cancelled = false
    setError(null)
    setScale(1)
    async function render() {
      try {
        const id = `erd-group-${++renderCounter}`
        const { svg } = await mermaid.render(id, diagram)
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg
          const svgEl = containerRef.current.querySelector('svg')
          if (svgEl) {
            svgEl.style.width = '100%'
            svgEl.style.height = 'auto'
            svgEl.removeAttribute('width')
            svgEl.removeAttribute('height')
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message)
      }
    }
    render()
    return () => { cancelled = true }
  }, [diagram])

  if (error) return (
    <div className="font-mono text-xs text-danger p-4">ERD render failed: {error}</div>
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Zoom controls */}
      <div className="flex items-center gap-2 justify-end">
        <span className="font-mono text-xs text-text-dim">Zoom:</span>
        <button
          onClick={() => setScale(s => Math.max(0.4, +(s - 0.2).toFixed(1)))}
          className="font-mono text-xs border border-border text-text-dim px-2 py-1 hover:border-accent hover:text-accent transition-colors"
        >−</button>
        <span className="font-mono text-xs text-accent w-10 text-center">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale(s => Math.min(3, +(s + 0.2).toFixed(1)))}
          className="font-mono text-xs border border-border text-text-dim px-2 py-1 hover:border-accent hover:text-accent transition-colors"
        >+</button>
        <button
          onClick={() => setScale(1)}
          className="font-mono text-xs border border-border text-text-dim px-2 py-1 hover:border-accent hover:text-accent transition-colors"
        >Reset</button>
      </div>

      {/* Diagram */}
      <div className="overflow-auto" style={{ maxHeight: '55vh' }}>
        <div
          ref={containerRef}
          style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.15s ease' }}
        />
      </div>
    </div>
  )
}

export default function TablesModal({ onClose, onQuery }) {
  const [tab, setTab] = useState('tables')
  const [erdGroup, setErdGroup] = useState(0)

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-surface border border-border p-6 mx-4 flex flex-col"
        style={{ width: tab === 'erd' ? '80vw' : '32rem', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">Database</span>
          <div className="flex-1 h-px bg-border" />
          <span className="font-mono text-xs text-muted">23 tables</span>
        </div>

        {/* Main tabs */}
        <div className="flex gap-1 mb-4 border-b border-border">
          {['tables', 'erd'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border-b-2 transition-colors ${
                tab === t ? 'border-accent text-accent' : 'border-transparent text-text-dim hover:text-accent'
              }`}
            >
              {t === 'erd' ? 'ERD' : 'Tables'}
            </button>
          ))}
        </div>

        {/* ERD group tabs */}
        {tab === 'erd' && (
          <div className="flex flex-wrap gap-1 mb-4">
            {ERD_GROUPS.map((g, i) => (
              <button
                key={g.label}
                onClick={() => setErdGroup(i)}
                className={`font-mono text-xs tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                  erdGroup === i
                    ? 'border-accent text-accent bg-accent/10'
                    : 'border-border text-text-dim hover:border-accent hover:text-accent'
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="overflow-auto flex-1">
          {tab === 'tables' ? (
            TABLES.map(([name, desc]) => (
              <button
                key={name}
                onClick={() => { onQuery(`SELECT * FROM ${name} LIMIT 20;`); onClose() }}
                className="w-full text-left px-3 py-2 border-b border-border-dim hover:bg-surface-low group transition-colors"
              >
                <div className="font-mono text-xs text-accent group-hover:text-accent-bright">{name}</div>
                <div className="font-body text-xs text-text-dim mt-0.5">{desc}</div>
              </button>
            ))
          ) : (
            <ErdGroup key={erdGroup} diagram={ERD_GROUPS[erdGroup].diagram} />
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors self-start"
        >
          Close
        </button>
      </div>
    </div>
  )
}
