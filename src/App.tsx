import { useState } from 'react'
import './tbt.css'
import BrushingTimer from './components/BrushingTimer'
import Settings from './components/Settings'
import { useI18n } from './i18n'

function App() {
  const [showSettings, setShowSettings] = useState(false)
  const { t } = useI18n()

  return (
    <div className="app-root">
      <header className="topbar">
        <h1 className="title">{t('app.title')}</h1>
        <button
          className="gear"
          aria-label={t('settings')}
          onClick={() => setShowSettings(true)}
        >
          ⚙️
        </button>
      </header>

      <main className="main">
        <BrushingTimer />
      </main>

      {showSettings && <Settings onClose={() => setShowSettings(false)} />}

      <footer className="footer">{t('app.footer')}</footer>
    </div>
  )
}

export default App
