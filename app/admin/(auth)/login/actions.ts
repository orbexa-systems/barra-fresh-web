'use server'

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export type LoginState = { error: string | null }

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Ingresa tu correo y contraseña.' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: 'Credenciales incorrectas. Verifica tu correo y contraseña.' }
  }

  redirect('/admin')
}
