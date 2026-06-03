import en from './locales/en.json'
import de from './locales/de.json'
import React, { createContext, useContext, useMemo, useState } from 'react'

type LocaleMap = typeof en

const resources: Record<string, LocaleMap> = { en, de }
const DEFAULT = 'en'
const SETTINGS_KEY = 'tbt.settings'

function detectLocale() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (raw) {
      const s = JSON.parse(raw)
      if (s.lang) return s.lang
    }
  } catch {}
  const nav = navigator.language.split('-')[0]
  return resources[nav] ? nav : DEFAULT
}

const I18nContext = createContext({ t: (k: string) => k, locale: DEFAULT, setLocale: (l: string) => {} })

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState(detectLocale())
  const dict = useMemo(() => resources[locale] || resources[DEFAULT], [locale])
  const t = (k: string) => {
    return (dict as any)[k] || k
  }
  return <I18nContext.Provider value={{ t, locale, setLocale }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('i18n context missing')
  return ctx
}

export default I18nProvider
