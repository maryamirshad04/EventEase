import { useEffect } from 'react'

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose?.() }
    if (isOpen) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-textDark/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className={`relative bg-offWhite rounded-xl shadow-xl w-full ${maxWidth} animate-slide-up border border-border flex flex-col`}
        style={{ maxHeight: 'calc(100vh - 24px)' }}
      >
        {/* Header — fixed, never scrolls */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border flex-shrink-0 min-w-0">
          <h2 className="font-display text-lg sm:text-xl font-semibold text-maroon truncate pr-3">{title}</h2>
          <button
            onClick={onClose}
            className="text-textLight hover:text-maroon transition-colors p-1.5 rounded-md hover:bg-champagne flex-shrink-0"
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="px-4 sm:px-6 py-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer — fixed at bottom */}
        {footer && (
          <div className="flex justify-end gap-3 px-4 sm:px-6 py-4 border-t border-border bg-beige/50 rounded-b-xl flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}