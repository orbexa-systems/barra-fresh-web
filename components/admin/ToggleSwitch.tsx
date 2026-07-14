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
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light disabled:opacity-50 ${
        checked ? 'bg-brand-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  )
}
