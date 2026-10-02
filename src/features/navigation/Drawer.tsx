import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { m } from '@/features/i18n'
import { IconButton } from '@/shared/ui/IconButton'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/** Mobile side panel built on <dialog> — focus trapping and Esc come for free. */
export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className="m-0 h-dvh max-h-none w-[min(22rem,88vw)] max-w-none bg-bg p-0 text-ink backdrop:bg-black/40 ltr:mr-auto rtl:ml-auto"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <span className="font-semibold">{title}</span>
          <IconButton label={m.nav_close_menu()} onClick={onClose}>
            <X size={18} />
          </IconButton>
        </div>
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">{children}</div>
      </div>
    </dialog>
  )
}
