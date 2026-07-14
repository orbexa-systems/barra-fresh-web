'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
  },
  {
    href: '/admin/pedidos',
    label: 'Pedidos',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z" />
        <path d="M16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
      </svg>
    ),
  },
  {
    href: '/admin/menu',
    label: 'Menú',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/admin/configurador',
    label: 'Configurador',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    href: '/admin/reportes',
    label: 'Reportes',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
              <path d="M12 2C7 2 3 7 3 12c0 2.5 1 4.8 2.6 6.5C7 20 9.4 21 12 21s5-1 6.4-2.5C20 16.8 21 14.5 21 12c0-5-4-10-9-10z" fill="white" fillOpacity="0.25"/>
              <path d="M12 21V10M12 10C12 10 8 8 6 5M12 10C12 10 16 8 18 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="leading-none">
            <p className="font-bold text-gray-900 text-sm">BarraFresh</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {NAV.map(item => {
          const isActive =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-surface text-brand-primary-dark'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className={isActive ? 'text-brand-primary' : 'text-gray-400'}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-100">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          Ver sitio público
        </Link>
      </div>
    </aside>
  )
}
