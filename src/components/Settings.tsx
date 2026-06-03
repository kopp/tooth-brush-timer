import React, { useState } from 'react'
import { useI18n } from '../i18n'

const SETTINGS_KEY = 'tbt.settings'

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? JSON.parse(raw) : { chewing: 15, outside: 20, inside: 15, lang: undefined }
  } catch {
    return { chewing: 15, outside: 20, inside: 15, lang: undefined }
  }
}

export default function Settings({ onClose }: { onClose: () => void }) {
  const { t, setLocale } = useI18n()
  const s = loadSettings()
  const [chewing, setChewing] = useState(s.chewing)
  const [outside, setOutside] = useState(s.outside)
  const [inside, setInside] = useState(s.inside)
  const [lang, setLang] = useState(s.lang || navigator.language.split('-')[0])

  function save() {
    const payload = { chewing: Number(chewing), outside: Number(outside), inside: Number(inside), lang }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload))
    setLocale(lang)
    onClose()
  }

  return (
    <div className="settings-overlay" role="dialog" aria-modal>
      <div className="settings-panel">
        <h2>{t('settings')}</h2>
        <label>
          {t('label.chewing')}
          <input type="number" min={1} value={chewing} onChange={(e) => setChewing(Number(e.target.value))} />
        </label>
        <label>
          {t('label.outside')}
          <input type="number" min={1} value={outside} onChange={(e) => setOutside(Number(e.target.value))} />
        </label>
        <label>
          {t('label.inside')}
          <input type="number" min={1} value={inside} onChange={(e) => setInside(Number(e.target.value))} />
        </label>

        <label>
          {t('label.language')}
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </label>

        <div className="settings-actions">
          <button onClick={save}>{t('save')}</button>
          <button onClick={onClose}>{t('cancel')}</button>
        </div>
      </div>
    </div>
  )
}
