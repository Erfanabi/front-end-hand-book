import { useSyncExternalStore } from 'react'

type Theme = 'light' | 'dark'

const listeners = new Set<() => void>()
const current = (): Theme => (document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function setTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  localStorage.setItem('theme', theme)
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current)
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}
