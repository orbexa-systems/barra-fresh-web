import { LoginForm } from './LoginForm'

export const metadata = { title: 'Admin — BarraFresh' }

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-primary shadow-md mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" aria-hidden="true">
              <path d="M12 2C7 2 3 7 3 12c0 2.5 1 4.8 2.6 6.5C7 20 9.4 21 12 21s5-1 6.4-2.5C20 16.8 21 14.5 21 12c0-5-4-10-9-10z" fill="white" fillOpacity="0.25"/>
              <path d="M12 21V10M12 10C12 10 8 8 6 5M12 10C12 10 16 8 18 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BarraFresh</h1>
          <p className="text-sm text-gray-500 mt-1">Panel de administración</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Iniciar sesión</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
