import type { ReactNode } from 'react'
import { Avatar } from '@/shared/ui'
import { cn } from '@/shared/lib'
import styles from './ChatListItem.module.css'

interface ChatListItemProps {
  title: string
  preview?: ReactNode
  time?: string
  active?: boolean
  onClick: () => void
}

export function ChatListItem({ title, preview, time, active, onClick }: ChatListItemProps) {
  return (
    <button className={cn(styles.item, active && styles.active)} onClick={onClick}>
      <Avatar name={title} />
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.title}>{title}</span>
          {time && <span className={styles.time}>{time}</span>}
        </div>
        <div className={styles.preview}>{preview ?? 'Нет сообщений'}</div>
      </div>
    </button>
  )
}
