import {
  Atom,
  Binary,
  Braces,
  FileType2,
  FlaskConical,
  FileCode2,
  Globe,
  Layers,
  MessagesSquare,
  Palette,
  Shapes,
  Zap,
  type LucideIcon,
} from 'lucide-react'

/** Visual identity of each part: an icon and a tile gradient (used on cards and the chapter header). */
export const partMeta: Record<string, { icon: LucideIcon; tile: string }> = {
  html: { icon: FileCode2, tile: 'from-[#ff8a4c] to-[#f2542d]' },
  css: { icon: Palette, tile: 'from-[#5b8cff] to-[#2459e0]' },
  javascript: { icon: Braces, tile: 'from-[#ffd23f] to-[#f2a900]' },
  typescript: { icon: FileType2, tile: 'from-[#4f8cff] to-[#1f5fc4]' },
  browser: { icon: Globe, tile: 'from-[#34d1bf] to-[#0f9d8a]' },
  react: { icon: Atom, tile: 'from-[#5ee0ff] to-[#139ac2]' },
  tooling: { icon: FlaskConical, tile: 'from-[#ffb86b] to-[#d9822b]' },
  algorithms: { icon: Binary, tile: 'from-[#b38bff] to-[#7c4ddb]' },
  patterns: { icon: Shapes, tile: 'from-[#ff7eb6] to-[#d63a83]' },
  architecture: { icon: Layers, tile: 'from-[#8fd16a] to-[#4c9a2a]' },
  interview: { icon: MessagesSquare, tile: 'from-[#ff9f6b] to-[#e0662a]' },
  cheatsheet: { icon: Zap, tile: 'from-[#a3a9b8] to-[#4b5262]' },
}

export const iconOf = (partId: string) => partMeta[partId]?.icon ?? Braces
