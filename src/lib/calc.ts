/**
 * Lógica pura de cálculo de custo de impressão 3D.
 * Sem dependência de React: fácil de testar e reaproveitar.
 */

export interface CalcInput {
  /** Preço do filamento em R$/kg */
  filamentPricePerKg: number
  /** Gramas usadas na peça (valor do fatiador) */
  gramsUsed: number
  /** Consumo médio da impressora em watts */
  printerWatts: number
  /** Duração da impressão em horas */
  printHours: number
  /** Tarifa de energia em R$/kWh (já com impostos) */
  kwhPrice: number
  /** Adicional da bandeira tarifária em R$/kWh */
  flagSurchargePerKwh: number
  /** Preço da impressora em R$ (0 = ignora amortização) */
  printerPrice: number
  /** Vida útil estimada da impressora em horas */
  printerLifeHours: number
  /** Mão de obra: valor fixo por peça em R$ */
  laborCost: number
  /** Custos fixos por peça (desgaste, manutenção) em R$ */
  fixedCosts: number
  /** Margem de lucro em % */
  marginPercent: number
}

export interface CalcResult {
  filamentCost: number
  energyCost: number
  energyKwh: number
  amortizationCost: number
  laborCost: number
  fixedCosts: number
  totalCost: number
  costPerGram: number
  profit: number
  finalPrice: number
}

/** Garante número finito e não-negativo (inputs vazios viram 0) */
const safe = (n: number): number => (Number.isFinite(n) && n > 0 ? n : 0)

export function calculate(raw: CalcInput): CalcResult {
  const i: CalcInput = {
    filamentPricePerKg: safe(raw.filamentPricePerKg),
    gramsUsed: safe(raw.gramsUsed),
    printerWatts: safe(raw.printerWatts),
    printHours: safe(raw.printHours),
    kwhPrice: safe(raw.kwhPrice),
    flagSurchargePerKwh: safe(raw.flagSurchargePerKwh),
    printerPrice: safe(raw.printerPrice),
    printerLifeHours: safe(raw.printerLifeHours),
    laborCost: safe(raw.laborCost),
    fixedCosts: safe(raw.fixedCosts),
    marginPercent: safe(raw.marginPercent),
  }

  // Filamento: preço por grama × gramas
  const filamentCost = (i.filamentPricePerKg / 1000) * i.gramsUsed

  // Energia: kWh consumidos × (tarifa + bandeira)
  const energyKwh = (i.printerWatts / 1000) * i.printHours
  const energyCost = energyKwh * (i.kwhPrice + i.flagSurchargePerKwh)

  // Amortização: custo por hora de uso da máquina × horas da peça
  const amortizationCost =
    i.printerPrice > 0 && i.printerLifeHours > 0
      ? (i.printerPrice / i.printerLifeHours) * i.printHours
      : 0

  const totalCost =
    filamentCost + energyCost + amortizationCost + i.laborCost + i.fixedCosts

  const costPerGram = i.gramsUsed > 0 ? totalCost / i.gramsUsed : 0
  const profit = totalCost * (i.marginPercent / 100)
  const finalPrice = totalCost + profit

  return {
    filamentCost,
    energyCost,
    energyKwh,
    amortizationCost,
    laborCost: i.laborCost,
    fixedCosts: i.fixedCosts,
    totalCost,
    costPerGram,
    profit,
    finalPrice,
  }
}
