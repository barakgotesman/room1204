export default function Header({ onHintClick, onTablesClick }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-bg flex-shrink-0">
      <div className="flex items-center gap-4">
        <img
          src="/logo.png"
          alt="Room 1204"
          className="h-16 w-16 object-contain"
        />
        <div className="flex flex-col">
          <h1 className="font-display text-lg font-bold text-accent leading-tight tracking-wide">
            ROOM 1204
          </h1>
          <span className="font-mono text-xs text-text-dim tracking-widest uppercase leading-tight">
            The Davos Affair
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onTablesClick}
          className="font-mono text-xs tracking-widest uppercase text-text-dim border border-border px-4 py-2 hover:border-accent hover:text-accent transition-colors"
        >
          📋 Tables
        </button>
        <button
          onClick={onHintClick}
          className="font-mono text-xs tracking-widest uppercase text-accent border border-accent px-4 py-2 hover:bg-accent hover:text-bg transition-colors"
        >
          ❓ Hint
        </button>
      </div>
    </header>
  )
}
