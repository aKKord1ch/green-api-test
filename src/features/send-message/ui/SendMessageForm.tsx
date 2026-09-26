import { useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import type { Chat } from '@/entities/chat'
import { MAX_MESSAGE_LENGTH } from '@/shared/config'
import { Icon } from '@/shared/ui'
import { useSendMessage } from '../model/useSendMessage'
import styles from './SendMessageForm.module.css'

const MAX_TEXTAREA_HEIGHT = 160

/** Рендерить с key={chat.id}, чтобы черновик и фокус сбрасывались при смене чата. */
export function SendMessageForm({ chat }: { chat: Chat }) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const send = useSendMessage(chat)

  // Поле ввода растёт вместе с текстом до MAX_TEXTAREA_HEIGHT.
  useLayoutEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`
  }, [text])

  const submit = () => {
    const message = text.trim()
    if (!message) return
    void send(message)
    setText('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={styles.input}
        placeholder="Сообщение"
        rows={1}
        maxLength={MAX_MESSAGE_LENGTH}
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button
        type="submit"
        className={styles.send}
        disabled={!text.trim()}
        aria-label="Отправить"
        title="Отправить"
      >
        <Icon name="send" />
      </button>
    </form>
  )
}
