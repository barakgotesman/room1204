import { HINTS } from '../lib/hints'

export default function HintPanel({ stage, onClose }) {
  const hint = HINTS[Math.min(stage, HINTS.length - 1)]

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className={`bg-surface p-8 max-w-md w-full mx-4 ${hint ? 'border border-accent' : 'border border-border'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-xs tracking-widest uppercase text-accent">Intelligence</span>
          <div className="flex-1 h-px bg-border" />
          {hint && <span className="font-mono text-xs text-muted">Stage {stage}</span>}
        </div>
        <p className="font-body text-sm leading-relaxed text-text-dim">
          {hint ?? "No intelligence available yet. Run some queries first — start with incident_reports."}
        </p>
        <button
          onClick={onClose}
          className="mt-6 font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors"
        >
          {hint ? 'Understood' : 'Close'}
        </button>
      </div>
    </div>
  )
}
