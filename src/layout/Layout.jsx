import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, onHintClick, onTablesClick, onExportClick, startTime, timerStopped }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onHintClick={onHintClick} onTablesClick={onTablesClick} onExportClick={onExportClick} />
      {/* Use flex-1 + min-h-0 so children can scroll independently without overflowing */}
      <main className="flex flex-1 min-h-0 overflow-hidden">
        {children}
      </main>
      <Footer startTime={startTime} stopped={timerStopped} />
    </div>
  )
}
