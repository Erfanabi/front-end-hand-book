import { Fragment } from 'react'
import { Navigate, Outlet, useParams } from 'react-router'
import { activateLocale, isLocale, preferredLocale } from './locale'

/** Route element for `/:lang/*` — validates the locale and activates it before children render. */
export function LocaleLayout() {
  const { lang } = useParams()

  if (!lang || !isLocale(lang)) {
    return <Navigate to={`/${preferredLocale()}`} replace />
  }

  activateLocale(lang)

  // Remount on locale change so every message function re-reads the new locale.
  return (
    <Fragment key={lang}>
      <Outlet />
    </Fragment>
  )
}

export function RootRedirect() {
  return <Navigate to={`/${preferredLocale()}`} replace />
}
