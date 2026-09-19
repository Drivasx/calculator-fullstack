import './Keypad.style.css'
import Key from '../Key/Key'
import type { CalculatorKey } from '../../types/calculator'

type KeyConfig = {
  key: CalculatorKey
  span?: 1 | 2
}

const OPERATORS: readonly CalculatorKey[] = ['÷', '×', '−', '+', '=']
const FUNCTIONS: readonly CalculatorKey[] = ['AC', '√', '^', '%']

const KEYS: readonly KeyConfig[] = [
  { key: 'AC' },
  { key: '√' },
  { key: '^' },
  { key: '÷' },
  { key: '7' },
  { key: '8' },
  { key: '9' },
  { key: '×' },
  { key: '4' },
  { key: '5' },
  { key: '6' },
  { key: '−' },
  { key: '1' },
  { key: '2' },
  { key: '3' },
  { key: '+' },
  { key: '0', span: 2 },
  { key: '.' },
  { key: '%' },
  { key: '=' },
]

function variantOf(key: CalculatorKey): 'operator' | 'function' | undefined {
  if ((OPERATORS as readonly CalculatorKey[]).includes(key)) return 'operator'
  if ((FUNCTIONS as readonly CalculatorKey[]).includes(key)) return 'function'
  return undefined
}

export default function Keypad({
  onKeyPress,
}: {
  onKeyPress: (key: CalculatorKey) => void
}) {
  return (
    <div className="keypad">
      {KEYS.map(({ key, span }) => (
        <Key
          key={key}
          label={key}
          variant={variantOf(key)}
          span={span}
          onClick={() => onKeyPress(key)}
        />
      ))}
    </div>
  )
}