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
  { name: 'Ender 3', watts: 120, price: 1200 },
  { name: 'Ender 3 V3 SE', watts: 150, price: 1500 },
  { name: 'Bambu A1 mini', watts: 150, price: 1800 },
  { name: 'Bambu A1', watts: 200, price: 2500 },
  { name: 'Creality K1', watts: 300, price: 3000 },
  { name: 'Bambu P1S', watts: 250, price: 4500 },
  { name: 'Prusa MK4', watts: 150, price: 5000 },
  { name: 'Bambu X1C', watts: 350, price: 5500 },
]

export interface FilamentPreset {
  name: string
  pricePerKg: number
}

export const FILAMENTS: FilamentPreset[] = [
  { name: 'PLA Basic', pricePerKg: 99 },
  { name: 'PLA Silk', pricePerKg: 120 },
  { name: 'PETG', pricePerKg: 110 },
  { name: 'ABS', pricePerKg: 100 },
  { name: 'TPU', pricePerKg: 150 },
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

/**
 * Tarifa residencial média por estado em R$/kWh (com impostos), aproximada.
 * Fonte: ranking ANEEL de tarifas residenciais. Ajuste conforme sua conta de luz.
 */
export interface StateTariff {
  uf: string
  name: string
  kwh: number
}

export const STATE_TARIFFS: StateTariff[] = [
  { uf: 'AC', name: 'Acre', kwh: 0.86 },
  { uf: 'AL', name: 'Alagoas', kwh: 0.89 },
  { uf: 'AM', name: 'Amazonas', kwh: 0.82 },
  { uf: 'AP', name: 'Amapá', kwh: 0.63 },
  { uf: 'BA', name: 'Bahia', kwh: 0.86 },
  { uf: 'CE', name: 'Ceará', kwh: 0.79 },
  { uf: 'DF', name: 'Distrito Federal', kwh: 0.76 },
  { uf: 'ES', name: 'Espírito Santo', kwh: 0.73 },
  { uf: 'GO', name: 'Goiás', kwh: 0.83 },
  { uf: 'MA', name: 'Maranhão', kwh: 0.76 },
  { uf: 'MG', name: 'Minas Gerais', kwh: 0.83 },
  { uf: 'MS', name: 'Mato Grosso do Sul', kwh: 0.89 },
  { uf: 'MT', name: 'Mato Grosso', kwh: 0.87 },
  { uf: 'PA', name: 'Pará', kwh: 0.96 },
  { uf: 'PB', name: 'Paraíba', kwh: 0.71 },
  { uf: 'PE', name: 'Pernambuco', kwh: 0.79 },
  { uf: 'PI', name: 'Piauí', kwh: 0.79 },
  { uf: 'PR', name: 'Paraná', kwh: 0.695 },
  { uf: 'RJ', name: 'Rio de Janeiro', kwh: 0.96 },
  { uf: 'RN', name: 'Rio Grande do Norte', kwh: 0.73 },
  { uf: 'RO', name: 'Rondônia', kwh: 0.81 },
  { uf: 'RR', name: 'Roraima', kwh: 0.69 },
  { uf: 'RS', name: 'Rio Grande do Sul', kwh: 0.79 },
  { uf: 'SC', name: 'Santa Catarina', kwh: 0.69 },
  { uf: 'SE', name: 'Sergipe', kwh: 0.76 },
  { uf: 'SP', name: 'São Paulo', kwh: 0.79 },
  { uf: 'TO', name: 'Tocantins', kwh: 0.86 },
]
