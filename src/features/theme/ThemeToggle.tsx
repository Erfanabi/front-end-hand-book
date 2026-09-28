import { Moon, Sun } from 'lucide-react'
import { m } from '@/features/i18n'
import { IconButton } from '@/shared/ui/IconButton'
import { useTheme } from './theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <IconButton label={m.nav_theme_toggle()} onClick={toggle}>
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  )
}
