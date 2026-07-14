import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

async function logoutAction() {
  'use server'
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export function AdminHeader({ email }: { email: string }) {
  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{email}</span>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors focus:outline-none focus-visible:underline"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  )
}
