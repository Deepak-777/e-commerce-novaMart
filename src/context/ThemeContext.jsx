// src/context/ThemeContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => {
    try {
      // Respect OS preference on first visit, then localStorage
      const stored = localStorage.getItem('theme')
      if (stored) return stored === 'dark'
      return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
    } catch (e) {
      console.warn('LocalStorage not available', e)
      return false
    }
  })

  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', dark)
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    } catch (e) {
      // ignore
    }
  }, [dark])

  const toggle = () => setDark((d) => !d)

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
