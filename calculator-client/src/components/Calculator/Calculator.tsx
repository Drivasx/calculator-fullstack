import './Calculator.style.css'
import { useCalculator } from '../../hooks/useCalculator'
import Display from '../Display/Display'
import Keypad from '../Keypad/Keypad'


export default function Calculator() {
  const { state, pressKey } = useCalculator()

  return (
    <main className="calculator">
      <Display expression={state.expression} value={state.current} />
      <Keypad onKeyPress={pressKey} />
    </main>
  )
}