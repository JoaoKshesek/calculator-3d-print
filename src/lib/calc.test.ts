import { describe, expect, it } from 'vitest'
import { calculate, type CalcInput } from './calc'

const base: CalcInput = {
  filamentPricePerKg: 90,
  gramsUsed: 140,
  printerWatts: 110,
  printHours: 5,
  kwhPrice: 1,
  flagSurchargePerKwh: 0,
  printerPrice: 0,
  printerLifeHours: 0,
  laborCost: 0,
  fixedCosts: 0,
  marginPercent: 100,
}

describe('calculate', () => {
  // Cenário idêntico ao exemplo 1 da referência online
  it('reproduz o exemplo de referência (R$12,60 + R$0,55 = R$13,15 → R$26,30)', () => {
    const r = calculate(base)
    expect(r.filamentCost).toBeCloseTo(12.6, 2)
    expect(r.energyCost).toBeCloseTo(0.55, 2)
    expect(r.totalCost).toBeCloseTo(13.15, 2)
    expect(r.costPerGram).toBeCloseTo(0.094, 3)
    expect(r.finalPrice).toBeCloseTo(26.3, 2)
  })

  it('aplica amortização apenas quando preço e vida útil são positivos', () => {
    const semVida = calculate({ ...base, printerPrice: 3500, printerLifeHours: 0 })
    expect(semVida.amortizationCost).toBe(0)

    const comVida = calculate({ ...base, printerPrice: 3500, printerLifeHours: 5000 })
    // 3500 / 5000 = 0,70 por hora × 5h = 3,50
    expect(comVida.amortizationCost).toBeCloseTo(3.5, 2)
  })

  it('soma bandeira tarifária ao kWh', () => {
    const r = calculate({ ...base, kwhPrice: 0.7, flagSurchargePerKwh: 0.04463 })
    // 0,55 kWh × 0,74463
    expect(r.energyCost).toBeCloseTo(0.55 * 0.74463, 4)
  })

  it('inclui mão de obra e custos fixos no total e na margem', () => {
    const r = calculate({ ...base, laborCost: 15, fixedCosts: 2, marginPercent: 30 })
    expect(r.totalCost).toBeCloseTo(13.15 + 17, 2)
    expect(r.finalPrice).toBeCloseTo((13.15 + 17) * 1.3, 2)
  })

  it('trata inputs inválidos (NaN, negativos) como zero sem quebrar', () => {
    const r = calculate({ ...base, gramsUsed: NaN, printerWatts: -50 })
    expect(r.filamentCost).toBe(0)
    expect(r.energyCost).toBe(0)
    expect(r.costPerGram).toBe(0)
    expect(Number.isFinite(r.finalPrice)).toBe(true)
  })
})
