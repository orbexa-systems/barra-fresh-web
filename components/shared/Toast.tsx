'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

type ToastVariant = 'success' | 'error' | 'warning'
type ToastItem = { id: number; message: string; variant: ToastVariant }
type ToastCtx = { showToast: (message: string, variant?: ToastVariant) => void }

const ToastContext = createContext<ToastCtx>({ showToast: () => {} })

const STYLES: Record<ToastVariant, { border: string; icon: React.ReactNode }> = {
  success: {
    border: 'border-brand-primary',
    icon: (
      <svg className="w-4 h-4 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
  error: {
    border: 'border-red-400',
    icon: (
      <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
  },
  warning: {
    border: 'border-brand-accent-dark',
    icon: (
      <svg className="w-4 h-4 text-brand-accent-dark shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const nextId = useRef(0)

  const dismiss = useCallback((id: number) => {
    setToasts(p => p.filter(t => t.id !== id))
  }, [])

  const showToast = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = ++nextId.current
    setToasts(p => [...p, { id, message, variant }])
    setTimeout(() => dismiss(id), 3000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notificaciones"
        className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map(t => {
          const { border, icon } = STYLES[t.variant]
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center gap-3 pl-3 pr-2 py-2.5 rounded-xl border-l-4 bg-white shadow-lg min-w-[240px] max-w-[340px] ${border}`}
            >
              {icon}
              <p className="flex-1 text-[13px] font-medium text-gray-800 leading-snug">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Cerrar notificación"
                className="p-1 rounded-md text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
