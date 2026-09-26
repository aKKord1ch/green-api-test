import { useMemo } from 'react'
import { ChatListItem, getChatTitle, useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { useCredentials } from '@/entities/session'
import { LogoutButton } from '@/features/auth'
import { CreateChatButton } from '@/features/create-chat'
import { formatShortDate } from '@/shared/lib'
import styles from './Sidebar.module.css'

interface SidebarProps {
  connectionError?: string | null
}

export function Sidebar({ connectionError }: SidebarProps) {
  const credentials = useCredentials()
  const chats = useChatStore((state) => state.chats)
  const activeChatId = useChatStore((state) => state.activeChatId)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const byChat = useMessageStore((state) => state.byChat)

  // Сверху — чаты с самой свежей активностью.
  const items = useMemo(
    () =>
      chats
        .map((chat) => {
          const messages = byChat[chat.id]
          const lastMessage = messages?.[messages.length - 1]
          return { chat, lastMessage, activity: lastMessage?.timestamp ?? chat.createdAt }
        })
        .sort((a, b) => b.activity - a.activity),
    [chats, byChat],
  )

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Чаты</h1>
          <span className={styles.instance}>Инстанс {credentials?.idInstance}</span>
        </div>
        <CreateChatButton />
        <LogoutButton />
      </header>

      {connectionError && <div className={styles.banner}>{connectionError}. Переподключаемся…</div>}

      <nav className={styles.list}>
        {items.length === 0 ? (
          <p className={styles.empty}>
            Чатов пока нет. Нажмите на карандаш сверху, чтобы написать по номеру телефона.
          </p>
        ) : (
          items.map(({ chat, lastMessage }) => (
            <ChatListItem
              key={chat.id}
              title={getChatTitle(chat)}
              preview={
                lastMessage &&
                (lastMessage.direction === 'outgoing' ? (
                  <>
                    <span className={styles.you}>Вы: </span>
                    {lastMessage.text}
                  </>
                ) : (
                  lastMessage.text
                ))
              }
              time={lastMessage ? formatShortDate(lastMessage.timestamp) : undefined}
              active={chat.id === activeChatId}
              onClick={() => setActiveChat(chat.id)}
            />
          ))
        )}
      </nav>
    </aside>
  )
}
