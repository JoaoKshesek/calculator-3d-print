const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formata em Real brasileiro: 13.15 → "R$ 13,15" */
export const formatBRL = (value: number): string => brl.format(value)

/** Formata número genérico com casas decimais opcionais */
export const formatNumber = (value: number, digits = 2): string =>
  new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(value)

/** Converte string do input em número; aceita vírgula como separador decimal */
export const parseNumber = (value: string): number => {
  const normalized = value.replace(/\s/g, '').replace(',', '.')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}
