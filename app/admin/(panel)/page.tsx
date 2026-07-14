import Link from 'next/link'
import { getDashboardStats } from '@/lib/data/dashboard'

function formatMXN(amount: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount)
}

const ACCESOS = [
  { href: '/admin/pedidos', label: 'Ver pedidos', desc: 'Gestiona y confirma pedidos', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { href: '/admin/menu', label: 'Editar menú', desc: 'Productos y categorías', color: 'bg-brand-surface text-brand-primary-dark border-brand-surface-mid' },
  { href: '/admin/configurador', label: 'Configurador', desc: 'Tamaños, toppings y aderezos', color: 'bg-amber-50 text-amber-700 border-amber-100' },
  { href: '/admin/reportes', label: 'Reportes', desc: 'Ventas y estadísticas', color: 'bg-purple-50 text-purple-700 border-purple-100' },
]

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const today = new Date().toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1 capitalize">{today}</p>
      </div>

      {/* Métricas del día */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Pedidos hoy</p>
          <p className="text-3xl font-extrabold text-gray-900">{stats.pedidosHoy}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ventas hoy</p>
          <p className="text-3xl font-extrabold text-brand-primary">{formatMXN(stats.ventasHoy)}</p>
        </div>
        <div className={`rounded-2xl border p-5 ${stats.pedidosPendientes > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${stats.pedidosPendientes > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
            Pendientes de confirmar
          </p>
          <div className="flex items-end gap-2">
            <p className={`text-3xl font-extrabold ${stats.pedidosPendientes > 0 ? 'text-amber-700' : 'text-gray-900'}`}>
              {stats.pedidosPendientes}
            </p>
            {stats.pedidosPendientes > 0 && (
              <Link href="/admin/pedidos" className="text-xs font-semibold text-amber-600 hover:text-amber-800 underline mb-1">
                Ver →
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top productos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Top productos del día</h2>
          {stats.topProductos.length === 0 ? (
            <p className="text-sm text-gray-400">Sin pedidos hoy todavía.</p>
          ) : (
            <ol className="space-y-2">
              {stats.topProductos.map((p, i) => (
                <li key={p.nombre} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-surface text-brand-primary-dark text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{p.nombre}</span>
                  <span className="text-sm font-semibold text-gray-900">{p.cantidad}×</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Accesos directos */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Accesos directos</h2>
          <div className="grid grid-cols-2 gap-3">
            {ACCESOS.map(a => (
              <Link
                key={a.href}
                href={a.href}
                className={`rounded-xl border p-4 hover:shadow-sm transition-shadow ${a.color}`}
              >
                <p className="font-semibold text-sm">{a.label}</p>
                <p className="text-xs mt-0.5 opacity-70">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
