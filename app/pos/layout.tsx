import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { POSHeader } from '@/components/pos/POSHeader'

export const metadata = { title: 'POS — BarraFresh' }

export default async function POSLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-gray-100">
      <POSHeader email={user.email ?? ''} />
      <div className="flex-1 overflow-hidden p-3">
        {children}
      </div>
    </div>
  )
}
