import { useParams } from 'react-router'
import { baseLocale, isLocale, type Locale } from './locale'

export function useLocale(): Locale {
  const { lang } = useParams()
  return lang && isLocale(lang) ? lang : baseLocale
}
