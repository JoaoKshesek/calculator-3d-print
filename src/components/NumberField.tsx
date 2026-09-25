import { useId } from 'react'

interface NumberFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  unit?: string
  hint?: string
  step?: number
  min?: number
}

/**
 * Input numérico controlado como string, para permitir apagar o campo
 * e digitar vírgula sem o React "brigar" com o valor.
 */
export function NumberField({
  label,
  value,
  onChange,
  unit,
  hint,
  step = 1,
  min = 0,
}: NumberFieldProps) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-surface-2 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/30">
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          step={step}
          min={min}
          className="w-full min-w-0 bg-transparent px-3 py-2.5 text-base tabular-nums outline-none"
        />
        {unit && (
          <span className="flex select-none items-center border-l border-border bg-surface px-3 text-sm text-muted">
            {unit}
          </span>
        )}
      </div>
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  )
}
