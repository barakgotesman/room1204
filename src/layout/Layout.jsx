import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, onHintClick, onTablesClick, onExportClick, startTime, timerStopped }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onHintClick={onHintClick} onTablesClick={onTablesClick} onExportClick={onExportClick} />
      <main className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 97px)' }}>
        {children}
      </main>
      <Footer startTime={startTime} stopped={timerStopped} />
    </div>
  )
}
