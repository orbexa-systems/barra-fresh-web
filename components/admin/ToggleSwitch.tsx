'use client'

import { useTransition } from 'react'

interface Props {
  checked: boolean
  onToggle: (value: boolean) => Promise<void>
  label?: string
}

export function ToggleSwitch({ checked, onToggle, label }: Props) {
  const [pending, startTransition] = useTransition()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={pending}
      onClick={() => startTransition(() => onToggle(!checked))}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light ${
        checked ? 'bg-brand-primary' : 'bg-gray-200'
      } ${pending ? 'opacity-70' : ''}`}
    >
      <span
        className={`inline-flex items-center justify-center h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      >
        {pending && (
          <svg className="w-2.5 h-2.5 animate-spin text-gray-400" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
      </span>
    </button>
  )
}
