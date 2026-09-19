import { add, sqrt as apiSqrt, divide, multiply, percentage, pow, subtract } from '../services/calculatorApi'
import type { CalculatorKey, CalculatorState, Operation } from '../types/calculator'

const DIGIT_LIMIT = 12
const OPERATORS: readonly Operation[] = ['+', '−', '×', '÷', '^']

export function createInitialState(): CalculatorState {
  return {
    current: '0',
    previous: null,
    operation: null,
    lastOperand: null,
    overwrite: false,
    justEvaluated: false,
    expression: '',
  }
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return 'Error'

  const rounded = Number.parseFloat(value.toPrecision(12))
  if (rounded === 0) return '0'

  const abs = Math.abs(rounded)
  // Número grande o muy pequeño -> notación científica
  if (abs >= 1e12 || abs < 1e-7) return rounded.toExponential(3)

  return String(rounded)
}

export async function evaluate(a: number, b: number, operation: Operation): Promise<number> {
  switch (operation) {
    case '+':
      return add(a, b)
    case '−':
      return subtract(a, b)
    case '×':
      return multiply(a, b)
    case '÷':
      return divide(a, b)
    case '√':
      return apiSqrt(b)
    case '^':
      return pow(a, b)
  }
}

function isOperator(key: CalculatorKey): key is Operation {
  return (OPERATORS as readonly string[]).includes(key)
}

function countDigits(value: string): number {
  return value.replace(/\D/g, '').length
}

function inputDigit(state: CalculatorState, digit: string): CalculatorState {
  if (state.current === 'Error') {
    return { ...createInitialState(), current: digit }
  }

  const justCleared = state.overwrite && state.justEvaluated

  let current: string
  if (state.overwrite) {
    current = digit
  } else if (state.current === '0') {
    current = digit
  } else if (state.current === '-0') {
    current = `-${digit}`
  } else if (countDigits(state.current) < DIGIT_LIMIT) {
    current = state.current + digit
  } else {
    current = state.current
  }

  return {
    ...state,
    current,
    overwrite: false,
    justEvaluated: false,
    expression: justCleared ? '' : state.expression,
  }
}

function inputDecimal(state: CalculatorState): CalculatorState {
  if (state.current === 'Error') {
    return { ...createInitialState(), current: '0.' }
  }

  const justCleared = state.overwrite && state.justEvaluated
  const current = state.overwrite
    ? '0.'
    : state.current.includes('.')
      ? state.current
      : `${state.current}.`

  return {
    ...state,
    current,
    overwrite: false,
    justEvaluated: false,
    expression: justCleared ? '' : state.expression,
  }
}

async function applyPercent(state: CalculatorState): Promise<CalculatorState> {
  if (state.current === 'Error') return state
  const value = Number.parseFloat(state.current)
  let result: number
  try {
    result = await percentage(value)
  } catch {
    return { ...state, current: 'Error', overwrite: true, justEvaluated: true }
  }
  return {
    ...state,
    current: formatNumber(result),
    overwrite: true,
    justEvaluated: false,
    lastOperand: null,
    expression: `${formatNumber(value)} %`,
  }
}

function pressSqrt(state: CalculatorState): CalculatorState {
  if (state.current === 'Error') {
    return { ...createInitialState(), operation: '√', expression: '√ ' }
  }

  const value = Number.parseFloat(state.current)
  const expression =
    value === 0 && !state.overwrite ? '√ ' : `√ ${formatNumber(value)}`

  return {
    current: formatNumber(value),
    previous: value,
    operation: '√',
    lastOperand: null,
    overwrite: true,
    justEvaluated: false,
    expression,
  }
}

function formatOperand(value: number): string {
  const text = formatNumber(value)
  return text.startsWith('-') ? `(${text})` : text
}

async function pressOperator(state: CalculatorState, operation: Operation): Promise<CalculatorState> {
  if (state.current === 'Error') {
    return { ...createInitialState(), operation, expression: `0 ${operation} ` }
  }

  const startingNumber =
      state.overwrite ||
      (state.operation === null && state.previous === null && state.current === '0')
  
    // Menos unario: `-6` como primer operando o como segundo (4 × -6)
    if (operation === '−' && !state.justEvaluated && (startingNumber || state.current === '-0')) {
      return {
        ...state,
        current: state.current === '-0' ? '0' : '-0', // doble − alterna
        overwrite: false,
        justEvaluated: false,
      }
    }


  const value = Number.parseFloat(state.current)

  if (state.operation !== null && !state.justEvaluated && !state.overwrite) {
    let result: number
    try {
      result = await evaluate(state.previous as number, value, state.operation)
    } catch {
      return { ...state, current: 'Error', overwrite: true, justEvaluated: true }
    }
    const resultText = formatNumber(result)
    return {
      current: resultText,
      previous: result,
      operation,
      lastOperand: null,
      overwrite: true,
      justEvaluated: false,
      expression: `${resultText} ${operation} `,
    }
  }

  return {
    current: formatNumber(value),
    previous: value,
    operation,
    lastOperand: null,
    overwrite: true,
    justEvaluated: false,
    expression: `${formatNumber(value)} ${operation} `,
  }
}

async function pressEquals(state: CalculatorState): Promise<CalculatorState> {
  const isUnary = state.operation === '√'
  if (state.overwrite && !state.justEvaluated && !isUnary) {
    return state // operador pendiente sin segundo operando: no evaluar
  }
  
  if (state.operation === null || state.previous === null) {
    if (state.current === 'Error') return createInitialState()
    return { ...state, overwrite: true, justEvaluated: true }
  }

  const operation = state.operation

  let a: number
  let b: number
  let lastOperand: number | null
  let expression: string

  if (state.justEvaluated && state.lastOperand !== null) {
    a = Number.parseFloat(state.current)
    b = state.lastOperand
    lastOperand = state.lastOperand
    expression =
      operation === '√'
        ? `√ ${formatNumber(b)} =`
        : `${formatNumber(a)} ${operation} ${formatOperand(b)} =`
  } else {
    a = state.previous
    b = Number.parseFloat(state.current)
    lastOperand = b
    expression =
      operation === '√'
        ? `√ ${formatNumber(b)} =`
        : `${formatNumber(state.previous)} ${operation} ${formatOperand(b)} =`
  }

  let result: number
  try {
    result = await evaluate(a, b, operation)
  } catch {
    return { ...state, current: 'Error', overwrite: true, justEvaluated: true }
  }

  return {
    current: formatNumber(result),
    previous: state.previous,
    operation,
    lastOperand,
    overwrite: true,
    justEvaluated: true,
    expression,
  }
}

export async function calculatorReducer(
  state: CalculatorState,
  key: CalculatorKey,
): Promise<CalculatorState> {
  if (key === 'AC') return createInitialState()
  if (key === '%') return applyPercent(state)
  if (key === '√') return pressSqrt(state)
  if (key === '=') return pressEquals(state)
  if (isOperator(key)) return pressOperator(state, key)
  if (key === '.') return inputDecimal(state)
  return inputDigit(state, key)
}