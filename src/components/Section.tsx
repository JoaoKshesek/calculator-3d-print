import type { ReactNode } from 'react'

interface SectionProps {
  title: string
  subtitle?: string
  icon?: ReactNode
  children: ReactNode
}

/** Card de seção do formulário (Filamento, Energia, etc.) */
export function Section({ title, subtitle, icon, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <header className="mb-5 flex items-start gap-3">
        {icon && (
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
            {icon}
          </span>
        )}
        <div>
          <h2 className="text-base font-semibold leading-tight">{title}</h2>
          {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
        </div>
      </header>
      <div className="grid gap-5">{children}</div>
    </section>
  )
}
