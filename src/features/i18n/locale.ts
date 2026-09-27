import {
  baseLocale,
  getTextDirection,
  isLocale,
  locales,
  overwriteGetLocale,
  type Locale,
} from '@/paraglide/runtime.js'

export { baseLocale, isLocale, locales, type Locale }

const STORAGE_KEY = 'locale'

let active: Locale = baseLocale

/**
 * The URL (`/fa/...`, `/en/...`) is the single source of truth for the locale.
 * Paraglide message functions read `getLocale()` at call time, so pointing it
 * at the router-provided value is enough — no provider or reload needed.
 */
overwriteGetLocale(() => active)

export function activateLocale(locale: Locale) {
  active = locale
  localStorage.setItem(STORAGE_KEY, locale)
  const root = document.documentElement
  root.lang = locale
  root.dir = getTextDirection(locale)
}

export function preferredLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isLocale(stored)) return stored
  return navigator.language.toLowerCase().startsWith('fa') ? 'fa' : baseLocale
}

export const otherLocale = (locale: Locale): Locale => (locale === 'fa' ? 'en' : 'fa')

export const directionOf = (locale: Locale) => getTextDirection(locale)

/** `/fa/css/grid` → `/en/css/grid` (keeps the rest of the path and the hash). */
export function switchLocalePath(pathname: string, to: Locale) {
  const [, , ...rest] = pathname.split('/')
  return `/${to}${rest.length ? '/' + rest.join('/') : ''}`
}
