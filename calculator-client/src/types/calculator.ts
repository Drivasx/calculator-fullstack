export type Operation = '+' | '−' | '×' | '÷' | '√' |  '^'

export type CalculatorKey =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '.'
  | 'AC'
  | '√'
  | '^'
  | '%'
  | '='
  | Operation

export interface CalculatorState {
  current: string
  previous: number | null
  operation: Operation | null
  lastOperand: number | null
  overwrite: boolean
  justEvaluated: boolean
  expression: string
}