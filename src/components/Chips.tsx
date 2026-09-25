interface Chip<T> {
  label: string
  value: T
  color?: string
}

interface ChipsProps<T> {
  items: Chip<T>[]
  onPick: (value: T) => void
  /** Item atualmente selecionado (comparado por label) */
  active?: string
  ariaLabel: string
}

/** Linha de atalhos clicáveis (presets) que preenchem um campo */
export function Chips<T>({ items, onPick, active, ariaLabel }: ChipsProps<T>) {
  return (
    <div className="flex flex-wrap content-start items-start gap-2" role="group" aria-label={ariaLabel}>
      {items.map((item) => {
        const isActive = item.label === active
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onPick(item.value)}
            aria-pressed={isActive}
            className={[
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
              isActive
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-border bg-surface-2 text-muted hover:border-accent/60 hover:text-text',
            ].join(' ')}
          >
            {item.color && (
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden
              />
            )}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
