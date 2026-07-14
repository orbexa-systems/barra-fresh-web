import { getReporte } from '@/lib/data/reportes'
import { ReportesClient } from './ReportesClient'
import type { PeriodoReporte } from '@/lib/data/reportes'

const PERIODOS_VALIDOS: PeriodoReporte[] = ['7d', '30d', '90d']

interface Props {
  searchParams: Promise<{ periodo?: string }>
}

export default async function ReportesAdminPage({ searchParams }: Props) {
  const { periodo: periodoParam } = await searchParams
  const periodo: PeriodoReporte =
    PERIODOS_VALIDOS.includes(periodoParam as PeriodoReporte)
      ? (periodoParam as PeriodoReporte)
      : '30d'

  const reporte = await getReporte(periodo)

  return (
    <div className="max-w-5xl">
      <ReportesClient reporte={reporte} periodo={periodo} />
    </div>
  )
}
