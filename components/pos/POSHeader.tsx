'use client'

import Link from 'next/link'
import { logoutAction } from '@/app/admin/auth-actions'

interface Props {
  email: string
}

export function POSHeader({ email }: Props) {
  const initial = email.charAt(0).toUpperCase()

  return (
    <header className="h-14 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" fill="none" className="w-[18px] h-[18px]" aria-hidden="true">
            <path d="M12 2C7 2 3 7 3 12c0 2.5 1 4.8 2.6 6.5C7 20 9.4 21 12 21s5-1 6.4-2.5C20 16.8 21 14.5 21 12c0-5-4-10-9-10z" fill="white" fillOpacity="0.2"/>
            <path d="M12 21V10M12 10C12 10 8 8 6 5M12 10C12 10 16 8 18 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <p className="font-bold text-gray-900 text-[14px] leading-tight">BarraFresh</p>
          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Punto de Venta</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-200 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          Ir al Admin
        </Link>

        <div className="flex items-center gap-2 pl-3 border-l border-gray-100">
          <div className="w-7 h-7 rounded-full bg-brand-surface border border-brand-surface-mid flex items-center justify-center shrink-0">
            <span className="text-brand-primary-dark font-bold text-xs">{initial}</span>
          </div>
          <span className="text-[13px] text-gray-700 font-medium max-w-[180px] truncate hidden sm:block">{email}</span>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd"/>
            </svg>
            Salir
          </button>
        </form>
      </div>
    </header>
  )
}
