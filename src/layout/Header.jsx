import { IconExport, IconTable, IconHint } from '../components/Icons'

export default function Header({ onHintClick, onTablesClick, onExportClick }) {
  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-bg flex-shrink-0">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="Room 1204"
          className="h-10 w-10 md:h-16 md:w-16 object-contain"
        />
        <div className="flex flex-col">
          <h1 className="font-display text-base md:text-lg font-bold text-accent leading-tight tracking-wide">
            ROOM 1204
          </h1>
          <span className="hidden md:block font-mono text-xs text-text-dim tracking-widest uppercase leading-tight">
            Room 1204
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Icon-only on mobile, icon + label on desktop */}
        <button
          onClick={onExportClick}
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-2 md:px-4 py-2 hover:border-accent hover:text-accent transition-colors"
          title="Export"
        >
          <IconExport />
          <span className="hidden md:inline">Export</span>
        </button>
        <button
          onClick={onTablesClick}
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-2 md:px-4 py-2 hover:border-accent hover:text-accent transition-colors"
          title="Tables"
        >
          <IconTable />
          <span className="hidden md:inline">Tables</span>
        </button>
        <button
          onClick={onHintClick}
          className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-accent border border-accent px-2 md:px-4 py-2 hover:bg-accent hover:text-bg transition-colors"
          title="Hint"
        >
          <IconHint />
          <span className="hidden md:inline">Hint</span>
        </button>
      </div>
    </header>
  )
}
