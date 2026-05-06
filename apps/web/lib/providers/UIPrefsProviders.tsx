'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type FontSize = 'normal' | 'large' | 'xlarge'
type ColourMode = 'standard' | 'high-contrast' | 'deuteranopia' | 'protanopia'

interface UIPrefs {
  fontSize: FontSize
  colourMode: ColourMode
}

interface UIPrefsContextValue {
  prefs: UIPrefs
  setPrefs: (prefs: UIPrefs) => void
}

const DEFAULT_PREFS: UIPrefs = { fontSize: 'normal', colourMode: 'standard' }

const FONT_SIZE_MAP: Record<FontSize, string> = {
  normal: '14px',
  large: '16px',
  xlarge: '18px',
}

const UIPrefsContext = createContext<UIPrefsContextValue>({
  prefs: DEFAULT_PREFS,
  setPrefs: () => {},
})

export const useUIPrefs = () => useContext(UIPrefsContext)

const applyPrefs = (prefs: UIPrefs) => {
  const root = document.documentElement
  root.style.setProperty('--cp-font-size-base', FONT_SIZE_MAP[prefs.fontSize] ?? '14px')
  root.setAttribute('data-colour-mode', prefs.colourMode)
}

const UIPrefsProvider = ({ children }: { children: React.ReactNode }) => {
  const [prefs, setPrefsState] = useState<UIPrefs>(DEFAULT_PREFS)

  // On mount: read from localStorage and apply immediately
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cp-ui-prefs')
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<UIPrefs>
        const merged: UIPrefs = {
          fontSize: parsed.fontSize ?? DEFAULT_PREFS.fontSize,
          colourMode: parsed.colourMode ?? DEFAULT_PREFS.colourMode,
        }
        setPrefsState(merged)
        applyPrefs(merged)
      }
    } catch {}
  }, [])

  const setPrefs = useCallback((next: UIPrefs) => {
    setPrefsState(next)
    applyPrefs(next)
    try {
      localStorage.setItem('cp-ui-prefs', JSON.stringify(next))
    } catch {}
  }, [])

  return (
    <UIPrefsContext.Provider value={{ prefs, setPrefs }}>
      {children}
    </UIPrefsContext.Provider>
  )
}

export default UIPrefsProvider