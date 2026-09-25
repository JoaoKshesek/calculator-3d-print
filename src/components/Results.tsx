import type { CalcResult } from '../lib/calc'
import { formatBRL, formatNumber } from '../lib/format'

interface ResultsProps {
  result: CalcResult
  marginPercent: number
  gramsUsed: number
}

interface RowProps {
  label: string
  value: string
  detail?: string
  share: number
}

/** Linha de custo com barra proporcional ao peso no total */
function Row({ label, value, detail, share }: RowProps) {
  return (
    <li className="grid gap-1">
      <div className="flex items-baseline justify-between gap-3 text-sm">
        <span className="text-muted">
          {label}
          {detail && <span className="ml-1 text-xs opacity-70">({detail})</span>}
        </span>
        <span className="font-medium tabular-nums">{value}</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-surface-2">
        <div
          className="h-full rounded-full bg-accent-2 transition-all"
          style={{ width: `${Math.min(100, share * 100)}%` }}
        />
      </div>
    </li>
  )
}

/** Painel lateral com o detalhamento e o preço final sugerido */
export function Results({ result, marginPercent, gramsUsed }: ResultsProps) {
  const total = result.totalCost || 1 // evita divisão por zero nas barras

  const rows: RowProps[] = [
    { label: 'Filamento', value: formatBRL(result.filamentCost), share: result.filamentCost / total },
    {
      label: 'Energia',
      value: formatBRL(result.energyCost),
      detail: `${formatNumber(result.energyKwh, 3)} kWh`,
      share: result.energyCost / total,
    },
    { label: 'Amortização', value: formatBRL(result.amortizationCost), share: result.amortizationCost / total },
    { label: 'Mão de obra', value: formatBRL(result.laborCost), share: result.laborCost / total },
    { label: 'Custos fixos', value: formatBRL(result.fixedCosts), share: result.fixedCosts / total },
  ].filter((r) => r.share > 0 || r.label === 'Filamento' || r.label === 'Energia')

  const lowMargin = marginPercent > 0 && marginPercent < 100

  return (
    <aside className="rounded-2xl border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-6">
      <h2 className="text-base font-semibold">Resultado</h2>
      <p className="mt-0.5 text-sm text-muted">Atualiza em tempo real conforme você digita.</p>

      {/* Preço final em destaque */}
      <div className="mt-5 rounded-xl border border-accent-2/30 bg-accent-2-soft p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-2">Você deve cobrar</p>
        <p className="mt-1 text-4xl font-bold tabular-nums">{formatBRL(result.finalPrice)}</p>
        <p className="mt-1 text-sm text-muted">
          Custo {formatBRL(result.totalCost)} + lucro {formatBRL(result.profit)} ({formatNumber(marginPercent)}%)
        </p>
      </div>

      <ul className="mt-5 grid gap-3">
        {rows.map((r) => (
          <Row key={r.label} {...r} />
        ))}
      </ul>

      <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
        <div>
          <dt className="text-muted">Custo total</dt>
          <dd className="font-semibold tabular-nums">{formatBRL(result.totalCost)}</dd>
        </div>
        <div>
          <dt className="text-muted">Custo por grama</dt>
          <dd className="font-semibold tabular-nums">
            {gramsUsed > 0 ? formatBRL(result.costPerGram) : '—'}
          </dd>
        </div>
      </dl>

      {lowMargin && (
        <p className="mt-4 rounded-lg border border-border bg-surface-2 p-3 text-xs text-muted">
          ⚠️ Os custos diretos de uma impressão são baixos. Para cobrir tempo de preparação,
          falhas e pós-processamento, muita gente trabalha com margem de 100% a 500%.
        </p>
      )}
    </aside>
  )
}
