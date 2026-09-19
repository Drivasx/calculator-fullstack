import './Key.style.css'

export default function Key({
  label,
  variant,
  span = 1,
  disabled = false,
  onClick,
}: {
  label: string
  variant?: 'operator' | 'function'
  span?: 1 | 2
  disabled?: boolean
  onClick?: () => void
}) {
  const classes = [
    'key',
    variant && `key--${variant}`,
    span > 1 && `key--span-${span}`,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type="button" className={classes} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  )
}