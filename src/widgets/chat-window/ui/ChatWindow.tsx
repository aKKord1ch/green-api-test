import { useEffect, useRef } from 'react'
import { getChatTitle, useActiveChat, useChatStore } from '@/entities/chat'
import { MessageBubble, useChatMessages } from '@/entities/message'
import { SendMessageForm } from '@/features/send-message'
import { formatPhone } from '@/shared/lib'
import { Avatar, Icon } from '@/shared/ui'
import styles from './ChatWindow.module.css'

export function ChatWindow() {
  const chat = useActiveChat()
  const messages = useChatMessages(chat?.id)
  const setActiveChat = useChatStore((state) => state.setActiveChat)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, chat?.id])

  if (!chat) {
    return (
      <section className={styles.window}>
        <div className={styles.placeholder}>
          <Icon name="chat" size={48} />
          <p>Выберите чат или создайте новый</p>
        </div>
      </section>
    )
  }

  const title = getChatTitle(chat)
  const subtitle = chat.phone && chat.name ? formatPhone(chat.phone) : 'MAX'

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <button
          className={styles.back}
          onClick={() => setActiveChat(null)}
          aria-label="Назад к списку чатов"
        >
          <Icon name="back" />
        </button>
        <Avatar name={title} size={40} />
        <div className={styles.headerText}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
      </header>

      <div className={styles.messages}>
        <div className={styles.messagesInner}>
          {messages.length === 0 && (
            <p className={styles.empty}>Напишите первое сообщение — оно придёт получателю в MAX</p>
          )}
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <footer className={styles.footer}>
        <SendMessageForm key={chat.id} chat={chat} />
      </footer>
    </section>
  )
}
