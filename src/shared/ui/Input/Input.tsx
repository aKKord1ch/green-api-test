import { useId, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className, id, ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={cn(styles.field, className)}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(styles.input, error && styles.invalid)}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {(error || hint) && (
        <span className={cn(styles.hint, error && styles.error)}>{error || hint}</span>
      )}
    </div>
  )
}
