# calculator-client — React + TypeScript

Calculator frontend. Responsive UI with a physical-style keypad, 
a pure reducer for state management, and a promise queue for backend calls.

---

## How to run it

```bash
npm install
npm run dev
# http://localhost:5173
```

API URL from `VITE_API_URL` (see `.env.example`). By default:

```
VITE_API_URL=http://localhost:8080/api/v1/calculator
```

## Tests

```bash
npm test                 # Vitest (watch)
npm run coverage         # report and coverage(v8)
npm run lint
```

Unit test for `calculator.ts`,
`Calculator.test.tsx` and components.

## Structure

- `src/lib/calculator.ts`.
- `src/services/calculatorApi.ts` — HTTP client from backend.
- `src/hooks/useCalculator.ts
- `src/components/` — `Calculator`, `Display`, `Key`, `Keypad` (each with its
  `.style.css`).
- `src/types/calculator.ts` — `Operation`, `CalculatorKey`, `CalculatorState`.
- `src/App.tsx` — mounts `Calculator`.


