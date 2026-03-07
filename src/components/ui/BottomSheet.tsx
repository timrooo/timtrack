import { ReactNode, useEffect } from 'react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <>
      <div className="bottom-sheet-overlay" onClick={onClose} />
      <div className="bottom-sheet" role="dialog" aria-modal>
        <div className="bottom-sheet-handle" />
        {title && (
          <div className="bottom-sheet-header">
            <span className="bottom-sheet-title">{title}</span>
            <button className="bottom-sheet-close" onClick={onClose} aria-label="Закрыть">
              ✕
            </button>
          </div>
        )}
        <div className="bottom-sheet-body">{children}</div>
      </div>
    </>
  )
}
