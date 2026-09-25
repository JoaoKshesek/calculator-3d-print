import { useEffect, useMemo, useState } from 'react'
import { calculate } from './lib/calc'
import { parseNumber } from './lib/format'
import { FILAMENTS, FLAGS, KWH_PR, LIFE_HOURS, MARGINS, PRINTERS } from './lib/presets'
import { Section } from './components/Section'
import { NumberField } from './components/NumberField'
import { Chips } from './components/Chips'
import { Results } from './components/Results'

/** Estado do formulário: tudo string para o input aceitar vazio e vírgula */
interface FormState {
  filamentPricePerKg: string
  gramsUsed: string
  printerWatts: string
  printHours: string
  kwhPrice: string
  flagId: string
  printerPrice: string
  printerLifeHours: string
  laborCost: string
  fixedCosts: string
  marginPercent: string
}

const DEFAULTS: FormState = {
  filamentPricePerKg: '99',
  gramsUsed: '100',
  printerWatts: '200',
  printHours: '5',
  kwhPrice: String(KWH_PR).replace('.', ','),
  flagId: 'verde',
  printerPrice: '4800',
  printerLifeHours: '5000',
  laborCost: '0',
  fixedCosts: '0',
  marginPercent: '100',
}

const STORAGE_KEY = 'calc3d:form:v2'

/** Carrega o último formulário salvo; qualquer falha cai nos defaults */
function loadInitial(): FormState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULTS
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<FormState>) }
  } catch {
    return DEFAULTS
  }
}

// Ícones inline (SVG simples, sem dependência extra)
const IconSpool = (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
  </svg>
)
const IconBolt = (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" strokeLinejoin="round" />
  </svg>
)
const IconPrinter = (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 7h8M8 11h8M10 15h4M12 15v3" />
  </svg>
)
const IconPlus = (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
)

export default function App() {
  const [form, setForm] = useState<FormState>(loadInitial)

  // Persiste cada alteração (sem quebrar em modo privado / storage bloqueado)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
    } catch {
      /* ignora */
    }
  }, [form])

  const set = (key: keyof FormState) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }))

  const flag = FLAGS.find((f) => f.id === form.flagId) ?? FLAGS[0]

  const result = useMemo(
    () =>
      calculate({
        filamentPricePerKg: parseNumber(form.filamentPricePerKg),
        gramsUsed: parseNumber(form.gramsUsed),
        printerWatts: parseNumber(form.printerWatts),
        printHours: parseNumber(form.printHours),
        kwhPrice: parseNumber(form.kwhPrice),
        flagSurchargePerKwh: flag.surchargePerKwh,
        printerPrice: parseNumber(form.printerPrice),
        printerLifeHours: parseNumber(form.printerLifeHours),
        laborCost: parseNumber(form.laborCost),
        fixedCosts: parseNumber(form.fixedCosts),
        marginPercent: parseNumber(form.marginPercent),
      }),
    [form, flag],
  )

  // Presets: qual chip está "ativo" é derivado do valor atual do campo
  const activeFilament = FILAMENTS.find(
    (f) => f.pricePerKg === parseNumber(form.filamentPricePerKg),
  )?.name
  const activePrinter = PRINTERS.find(
    (p) => p.watts === parseNumber(form.printerWatts),
  )?.name
  const activePrinterPrice = PRINTERS.find(
    (p) => p.price === parseNumber(form.printerPrice),
  )?.name
  const activeLife = LIFE_HOURS.find((h) => h === parseNumber(form.printerLifeHours))
  const activeMargin = MARGINS.find((m) => m === parseNumber(form.marginPercent))


  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent-2">
          Ferramenta gratuita
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
          Calculadora de Impressão 3D
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Descubra o custo real da sua peça: filamento, energia, desgaste da impressora, mão de
          obra e quanto cobrar com a margem que você escolher.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <form className="grid gap-6" onSubmit={(e) => e.preventDefault()}>
          {/* ---------- FILAMENTO ---------- */}
          <Section title="Filamento" subtitle="Material e quantidade da peça" icon={IconSpool}>
            <div>
              <p className="mb-2 text-sm font-medium">Material de referência</p>
              <Chips
                ariaLabel="Presets de filamento"
                items={FILAMENTS.map((f) => ({ label: f.name, value: f.pricePerKg }))}
                active={activeFilament}
                onPick={(v) => set('filamentPricePerKg')(String(v))}
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Preço do filamento"
                unit="R$/kg"
                value={form.filamentPricePerKg}
                onChange={set('filamentPricePerKg')}
              />
              <NumberField
                label="Quantidade utilizada"
                unit="g"
                value={form.gramsUsed}
                onChange={set('gramsUsed')}
                hint="Consulte o fatiador para saber a gramagem."
              />
            </div>
          </Section>

          {/* ---------- ENERGIA E TEMPO ---------- */}
          <Section title="Energia e tempo" subtitle="Consumo da impressora e tarifa da sua distribuidora" icon={IconBolt}>
            <div>
              <p className="mb-2 text-sm font-medium">Impressora de referência</p>
              <Chips
                ariaLabel="Presets de impressora"
                items={PRINTERS.map((p) => ({ label: `${p.name} (~${p.watts} W)`, value: p }))}
                active={activePrinter ? `${activePrinter} (~${PRINTERS.find((p) => p.name === activePrinter)!.watts} W)` : undefined}
                onPick={(p) =>
                  setForm((f) => ({
                    ...f,
                    printerWatts: String(p.watts),
                    printerPrice: String(p.price),
                  }))
                }
              />
              <p className="mt-1.5 text-xs text-muted">
                Selecionar uma impressora também preenche o preço na amortização.
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Consumo da impressora"
                unit="W"
                value={form.printerWatts}
                onChange={set('printerWatts')}
                hint="Média durante a impressão, não o pico."
              />
              <NumberField
                label="Tempo de impressão"
                unit="horas"
                value={form.printHours}
                onChange={set('printHours')}
                step={0.5}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Valor do kWh"
                unit="R$"
                value={form.kwhPrice}
                onChange={set('kwhPrice')}
                step={0.01}
                hint="Tarifa residencial média do Paraná (Copel), com impostos. Ajuste pelo valor da sua conta."
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium">Bandeira tarifária</p>
              <Chips
                ariaLabel="Bandeira tarifária"
                items={FLAGS.map((f) => ({
                  label: f.surchargePerKwh
                    ? `${f.name} (+R$ ${f.surchargePerKwh.toFixed(3).replace('.', ',')}/kWh)`
                    : f.name,
                  value: f.id,
                  color: f.color,
                }))}
                active={
                  flag.surchargePerKwh
                    ? `${flag.name} (+R$ ${flag.surchargePerKwh.toFixed(3).replace('.', ',')}/kWh)`
                    : flag.name
                }
                onPick={set('flagId')}
              />
            </div>
          </Section>

          {/* ---------- AMORTIZAÇÃO ---------- */}
          <Section
            title="Amortização da impressora"
            subtitle="Opcional: dilui o valor da máquina pelas horas de uso"
            icon={IconPrinter}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <NumberField
                  label="Preço da impressora"
                  unit="R$"
                  value={form.printerPrice}
                  onChange={set('printerPrice')}
                  hint="Deixe 0 para ignorar a amortização."
                />
                <Chips
                  ariaLabel="Preço de referência"
                  items={PRINTERS.map((p) => ({
                    label: `${p.name} ~R$ ${p.price.toLocaleString('pt-BR')}`,
                    value: p.price,
                  }))}
                  active={
                    activePrinterPrice
                      ? `${activePrinterPrice} ~R$ ${PRINTERS.find((p) => p.name === activePrinterPrice)!.price.toLocaleString('pt-BR')}`
                      : undefined
                  }
                  onPick={(v) => set('printerPrice')(String(v))}
                />
              </div>
              <div className="grid gap-2">
                <NumberField
                  label="Vida útil estimada"
                  unit="h"
                  value={form.printerLifeHours}
                  onChange={set('printerLifeHours')}
                />
                <Chips
                  ariaLabel="Vida útil de referência"
                  items={LIFE_HOURS.map((h) => ({ label: `${h.toLocaleString('pt-BR')} h`, value: h }))}
                  active={activeLife ? `${activeLife.toLocaleString('pt-BR')} h` : undefined}
                  onPick={(v) => set('printerLifeHours')(String(v))}
                />
              </div>
            </div>
          </Section>

          {/* ---------- OPCIONAIS ---------- */}
          <Section title="Opcionais" subtitle="Mão de obra, custos fixos e margem de lucro" icon={IconPlus}>
            <div className="grid gap-5 sm:grid-cols-2">
              <NumberField
                label="Mão de obra"
                unit="R$"
                value={form.laborCost}
                onChange={set('laborCost')}
                hint="Valor fixo por peça: preparação, acabamento, remoção de suportes."
              />
              <NumberField
                label="Custos fixos"
                unit="R$"
                value={form.fixedCosts}
                onChange={set('fixedCosts')}
                hint="Desgaste de bico, mesa, manutenção, embalagem."
              />
            </div>
            <div className="grid gap-2">
              <NumberField
                label="Margem de lucro"
                unit="%"
                value={form.marginPercent}
                onChange={set('marginPercent')}
              />
              <Chips
                ariaLabel="Margens sugeridas"
                items={MARGINS.map((m) => ({ label: `${m}%`, value: m }))}
                active={activeMargin !== undefined ? `${activeMargin}%` : undefined}
                onPick={(v) => set('marginPercent')(String(v))}
              />
            </div>
          </Section>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForm(DEFAULTS)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted transition hover:border-accent/60 hover:text-text"
            >
              Restaurar padrões
            </button>
          </div>
        </form>

        <Results
          result={result}
          marginPercent={parseNumber(form.marginPercent)}
          gramsUsed={parseNumber(form.gramsUsed)}
        />
      </div>

      <footer className="mt-10 text-xs text-muted">
        Tarifas por estado e bandeiras são valores de referência (ANEEL) e podem estar
        desatualizados. Confira sempre a sua conta de luz. Os dados ficam salvos apenas no seu
        navegador.
      </footer>
    </div>
  )
}
