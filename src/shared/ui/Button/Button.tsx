import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib'
import { Spinner } from '../Spinner/Spinner'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  loading?: boolean
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner size={18} /> : children}
    </button>
  )
}
