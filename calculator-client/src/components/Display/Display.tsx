import './Display.style.css'


export default function Display({
  expression = '',
  value = '0',
}: {
  expression?: string
  value?: string
}) {
  return (
    <div className="display" role="status" aria-live="polite">
      <span className="display__expression">{expression || '\u00a0'}</span>
      <span className="display__value" data-testid="display-value">
        {value}
      </span>
    </div>
  )
}