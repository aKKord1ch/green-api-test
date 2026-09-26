import { useChatStore } from '@/entities/chat'
import { useIncomingPolling } from '@/features/receive-messages'
import { cn } from '@/shared/lib'
import { ChatWindow } from '@/widgets/chat-window'
import { Sidebar } from '@/widgets/sidebar'
import styles from './ChatPage.module.css'

export function ChatPage() {
  const { error } = useIncomingPolling()
  const hasActiveChat = useChatStore((state) => state.activeChatId !== null)

  return (
    <main className={cn(styles.layout, hasActiveChat && styles.chatOpen)}>
      <div className={styles.sidebar}>
        <Sidebar connectionError={error} />
      </div>
      <div className={styles.content}>
        <ChatWindow />
      </div>
    </main>
  )
}
