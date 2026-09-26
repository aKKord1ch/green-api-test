import { cn, formatTime } from '@/shared/lib'
import { Icon } from '@/shared/ui'
import type { Message } from '../model/types'
import styles from './MessageBubble.module.css'

const STATUS_ICON = {
  sending: { name: 'clock', label: 'Отправляется' },
  sent: { name: 'check', label: 'Отправлено' },
  error: { name: 'error', label: 'Не удалось отправить' },
} as const

export function MessageBubble({ message }: { message: Message }) {
  const isOutgoing = message.direction === 'outgoing'
  const status = STATUS_ICON[message.status]

  return (
    <div className={cn(styles.row, isOutgoing ? styles.outgoing : styles.incoming)}>
      <div className={cn(styles.bubble, message.status === 'error' && styles.failed)}>
        <span className={styles.text}>{message.text}</span>
        <span className={styles.meta}>
          {formatTime(message.timestamp)}
          {isOutgoing && (
            <span title={status.label} className={styles[message.status]}>
              <Icon name={status.name} size={14} />
            </span>
          )}
        </span>
      </div>
    </div>
  )
}
