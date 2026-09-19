import { describe, expect, it, vi } from 'vitest'
import { add as mockAdd, sqrt as mockSqrt } from '../services/calculatorApi'
import {
  calculatorReducer,
  createInitialState,
  evaluate,
  formatNumber,
} from './calculator'
import type { CalculatorKey, CalculatorState } from '../types/calculator'

vi.mock('../services/calculatorApi', () => ({
  add: vi.fn(async (a: number, b: number) => a + b),
  subtract: vi.fn(async (a: number, b: number) => a - b),
  multiply: vi.fn(async (a: number, b: number) => a * b),
  divide: vi.fn(async (a: number, b: number) => {
    if (b === 0) throw new Error('You cannot divide by zero')
    return a / b
  }),
  pow: vi.fn(async (a: number, b: number) => a ** b),
  sqrt: vi.fn(async (b: number) => Math.sqrt(b)),
  percentage: vi.fn(async (b: number) => b / 100),
}))

async function press(keys: CalculatorKey[]): Promise<CalculatorState> {
  let state = createInitialState()
  for (const key of keys) {
    state = await calculatorReducer(state, key)
  }
  return state
}

describe('calculatorReducer', () => {
  it('starts at zero with an empty expression', () => {
    expect(createInitialState()).toEqual({
      current: '0',
      previous: null,
      operation: null,
      lastOperand: null,
      overwrite: false,
      justEvaluated: false,
      expression: '',
    })
  })

  it('appends digits and replaces a leading zero', async () => {
    const state = await press(['1', '2', '3'])
    expect(state.current).toBe('123')
    expect((await press(['0', '5'])).current).toBe('5')
  })

  it('limits input to 12 digits', async () => {
    const state = await press(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3'])
    expect(state.current).toBe('123456789012')
  })

  it('only allows a single decimal point', async () => {
    const state = await press(['1', '.', '5'])
    expect(state.current).toBe('1.5')
    expect((await press(['1', '.', '.', '5'])).current).toBe('1.5')
  })

  it('computes 7 + 3 = 10 through the API', async () => {
    const state = await press(['7', '+', '3', '='])
    expect(state.current).toBe('10')
    expect(state.expression).toBe('7 + 3 =')
    expect(mockAdd).toHaveBeenCalledWith(7, 3)
  })

  it('avoids floating point errors: 0.1 + 0.2 = 0.3', async () => {
    const state = await press(['0', '.', '1', '+', '0', '.', '2', '='])
    expect(state.current).toBe('0.3')
  })

  it('chains operations: 2 + 3 × 4 = 20', async () => {
    const state = await press(['2', '+', '3', '×', '4', '='])
    expect(state.current).toBe('20')
  })

  

  it('shows Error on division by zero and recovers on AC', async () => {
    const error = await press(['5', '÷', '0', '='])
    expect(error.current).toBe('Error')

    const reset = await calculatorReducer(error, 'AC')
    expect(reset.current).toBe('0')
    expect(reset.expression).toBe('')

    const recovered = await press(['5', '÷', '0', '=', '7'])
    expect(recovered.current).toBe('7')
    expect(recovered.expression).toBe('')
  })

  it('surfaces API failures as Error', async () => {
    vi.mocked(mockAdd).mockRejectedValueOnce(new Error('boom'))

    const state = await press(['5', '+', '3', '='])
    expect(state.current).toBe('Error')
  })

  it('wraps a negative second operand in parentheses', async () => {
    const state = await press(['4', '×', '−', '6', '='])
    expect(state.current).toBe('-24')
    expect(state.expression).toBe('4 × (-6) =')
  })
  
  it('does not wrap a negative first operand', async () => {
    const state = await press(['−', '6', '+', '2', '='])
    expect(state.expression).toBe('-6 + 2 =')
  })
  
  it('keeps parentheses when repeating with a negative operand', async () => {
    const state = await press(['4', '×', '−', '6', '=', '='])
    expect(state.expression).toBe('-24 × (-6) =')
  })

  it('turns a value into a percentage and shows it above the result', async () => {
    const state = await press(['5', '0', '%'])
    expect(state.current).toBe('0.5')
    expect(state.expression).toBe('50 %')
    expect((await press(['2', '0', '0', '%'])).current).toBe('2')
  })

  it('computes the square root of the current value', async () => {
    const state = await press(['9', '√', '='])
    expect(state.current).toBe('3')
    expect(state.expression).toBe('√ 9 =')
    expect(mockSqrt).toHaveBeenCalledWith(9)
  })

  it('pressing √ first leaves the expression empty and awaits the operand', async () => {
    const pending = await press(['√'])
    expect(pending.current).toBe('0')
    expect(pending.expression).toBe('√ ')

    const state = await press(['√', '9', '='])
    expect(state.current).toBe('3')
    expect(state.expression).toBe('√ 9 =')
  })

  it('reuses the result as the first operand after equals', async () => {
    const state = await press(['2', '+', '3', '=', '+', '1', '='])
    expect(state.current).toBe('6')
  })
})

describe('evaluate', () => {
  it.each(
    [
      [2, '+', 3, 5],
      [5, '−', 3, 2],
      [4, '×', 5, 20],
      [10, '÷', 4, 2.5],
    ] as const,
  )('%d %s %d = %d', async (a, op, b, expected) => {
    await expect(evaluate(a, b, op)).resolves.toBe(expected)
  })
})

describe('formatNumber', () => {
  it('formats whole numbers without decimals', () => {
    expect(formatNumber(42)).toBe('42')
  })

  it('rounds away float noise', () => {
    expect(formatNumber(0.1 + 0.2)).toBe('0.3')
  })

  it('marks non-finite values as Error', () => {
    expect(formatNumber(Number.NaN)).toBe('Error')
    expect(formatNumber(Number.POSITIVE_INFINITY)).toBe('Error')
  })
})