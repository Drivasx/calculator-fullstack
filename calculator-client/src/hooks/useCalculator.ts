import { useCallback, useRef, useState } from 'react'
import { calculatorReducer, createInitialState } from '../lib/calculator'
import type { CalculatorKey, CalculatorState } from '../types/calculator'

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>(createInitialState)
  const stateRef = useRef(state)
  const queueRef = useRef<Promise<void>>(Promise.resolve())

  const pressKey = useCallback((key: CalculatorKey) => {
    queueRef.current = queueRef.current
      .then(async () => {
        const next = await calculatorReducer(stateRef.current, key)
        stateRef.current = next
        setState(next)
      })
      .catch((error) => {
        stateRef.current = { ...stateRef.current, current: 'Error' }
        setState(stateRef.current)
        console.error(error)
      })
  }, [])

  return { state, pressKey }
}