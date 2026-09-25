# Calculadora de Impressão 3D

Calculadora de custo real de peças impressas em 3D, 100% client-side.
Considera filamento, energia (tarifa por estado + bandeira ANEEL), amortização da impressora,
mão de obra, custos fixos e margem de lucro. Os inputs ficam salvos no `localStorage`.

## Stack

- Vite 8 + React 19 + TypeScript
- Tailwind CSS 4 (plugin `@tailwindcss/vite`)
- Vitest (testes da lógica de cálculo)
- oxlint

## Rodando

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm test       # testes unitários (src/lib/calc.test.ts)
pnpm build      # typecheck + build em dist/
pnpm preview    # serve o build
```

## Estrutura

```
src/
├── App.tsx                 # formulário, estado e persistência
├── main.tsx
├── index.css               # tokens de tema (dark padrão, light via prefers-color-scheme)
├── lib/
│   ├── calc.ts             # lógica pura de cálculo (sem React)
│   ├── calc.test.ts        # testes da lógica
│   ├── presets.ts          # impressoras, filamentos, tarifas ANEEL, bandeiras
│   └── format.ts           # formatação BRL e parse de vírgula decimal
└── components/
    ├── Section.tsx         # card de seção
    ├── NumberField.tsx     # input numérico controlado
    ├── Chips.tsx           # presets clicáveis
    └── Results.tsx         # painel de resultado
```

## Fórmulas

| Item | Cálculo |
|------|---------|
| Filamento | `preço_kg / 1000 × gramas` |
| Energia | `watts / 1000 × horas × (tarifa_kWh + bandeira)` |
| Amortização | `preço_impressora / vida_útil_h × horas` |
| Custo total | filamento + energia + amortização + mão de obra + custos fixos |
| Preço final | `custo_total × (1 + margem / 100)` |

## Observações

- Tarifas por estado são médias residenciais aproximadas; ajuste pelo valor da sua conta.
- Bandeiras: amarela R$ 0,01885/kWh, vermelha P1 R$ 0,04463/kWh, vermelha P2 R$ 0,07877/kWh.
- O arquivo `.npmrc` fixa o registry público do npm para não cair no registry privado configurado globalmente.
