import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Calculator from './Calculator'

vi.mock('../../services/calculatorApi', () => ({
  add: vi.fn(async (a: number, b: number) => a + b),
  sqrt: vi.fn(async (b: number) => Math.sqrt(b)),
}))

function pressValue(key: string) {
  fireEvent.click(screen.getByRole('button', { name: key }))
}

async function expectDisplay(value: string) {
  await waitFor(() =>
    expect(screen.getByTestId('display-value').textContent).toBe(value),
  )
}

describe('Calculator', () => {
  it('computes 7 + 3 = 10', async () => {
    render(<Calculator />)

    pressValue('7')
    pressValue('+')
    pressValue('3')
    pressValue('=')

    await expectDisplay('10')
    expect(screen.getByRole('status').textContent).toContain('7 + 3 =')
  })

  it('clears everything with AC', async () => {
    render(<Calculator />)

    pressValue('9')
    pressValue('9')
    pressValue('AC')

    await expectDisplay('0')
  })

  it('handles decimals: 0.1 + 0.2 = 0.3', async () => {
    render(<Calculator />)

    pressValue('0')
    pressValue('.')
    pressValue('1')
    pressValue('+')
    pressValue('0')
    pressValue('.')
    pressValue('2')
    pressValue('=')

    await expectDisplay('0.3')
  })

  it('uses the result as first operand after equals', async () => {
    render(<Calculator />)

    pressValue('2')
    pressValue('+')
    pressValue('3')
    pressValue('=')
    pressValue('+')
    pressValue('1')
    pressValue('=')

    await expectDisplay('6')
  })

  it('shows Error on division by zero and recovers on AC', async () => {
    render(<Calculator />)

    pressValue('5')
    pressValue('÷')
    pressValue('0')
    pressValue('=')

    await expectDisplay('Error')

    pressValue('AC')
    await expectDisplay('0')
  })

  it('shows Error when the API fails', async () => {
    const { add } = await import('../../services/calculatorApi')
    vi.mocked(add).mockRejectedValueOnce(new Error('Error on api call'))

    render(<Calculator />)

    pressValue('5')
    pressValue('+')
    pressValue('3')
    pressValue('=')

    await expectDisplay('Error')
  })
})