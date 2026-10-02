import { Link } from 'react-router'
import { m, useLocale } from '@/features/i18n'

export function NotFoundPage() {
  const locale = useLocale()
  return (
    <div className="mx-auto max-w-xl py-24 text-center">
      <title>{m.not_found_title()}</title>
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-3 text-3xl font-bold text-ink">{m.not_found_title()}</h1>
      <p className="mt-3 text-ink-2">{m.not_found_body()}</p>
      <Link
        to={`/${locale}`}
        className="mt-8 inline-flex h-10 items-center rounded-lg bg-accent px-5 font-medium text-accent-ink"
      >
        {m.go_home()}
      </Link>
    </div>
  )
}
