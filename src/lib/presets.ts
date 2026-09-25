/**
 * Presets de referência. Valores aproximados (2025/2026) — o usuário
 * pode sempre sobrescrever manualmente.
 */

export interface PrinterPreset {
  name: string
  watts: number
  price: number
}

export const PRINTERS: PrinterPreset[] = [
  // A1 Combo (com AMS lite). Consumo médio em impressão ~200 W.
  { name: 'Bambu A1 + AMS', watts: 200, price: 4800 },
]

export interface FilamentPreset {
  name: string
  pricePerKg: number
}

export const FILAMENTS: FilamentPreset[] = [
  { name: 'PLA Basic', pricePerKg: 99 },
  { name: 'PLA Matte', pricePerKg: 109 },
  { name: 'PLA Silk', pricePerKg: 120 },
  { name: 'PETG', pricePerKg: 110 },
]

/** Vida útil estimada da impressora (horas) */
export const LIFE_HOURS = [3000, 5000, 8000]

/** Margens de lucro sugeridas (%) */
export const MARGINS = [30, 50, 80, 100, 200, 500]

/**
 * Bandeiras tarifárias ANEEL — adicional em R$/kWh.
 * Valores vigentes desde 2024 (por 100 kWh: amarela 1,885; vermelha P1 4,463; P2 7,877).
 */
export interface FlagPreset {
  id: string
  name: string
  surchargePerKwh: number
  color: string
}

export const FLAGS: FlagPreset[] = [
  { id: 'verde', name: 'Verde', surchargePerKwh: 0, color: '#22c55e' },
  { id: 'amarela', name: 'Amarela', surchargePerKwh: 0.01885, color: '#eab308' },
  { id: 'vermelha1', name: 'Vermelha P1', surchargePerKwh: 0.04463, color: '#ef4444' },
  { id: 'vermelha2', name: 'Vermelha P2', surchargePerKwh: 0.07877, color: '#b91c1c' },
]

/** Tarifa residencial média do Paraná (Copel) em R$/kWh, com impostos. Aproximada. */
export const KWH_PR = 0.695
