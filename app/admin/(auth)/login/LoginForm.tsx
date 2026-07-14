'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null })

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Correo electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:border-transparent transition-shadow"
          placeholder="admin@barrafresh.mx"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary-light focus:border-transparent transition-shadow"
          placeholder="••••••••"
        />
      </div>

      {state.error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full py-3 px-4 rounded-xl bg-brand-primary hover:bg-brand-primary-dark text-white font-semibold text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
