import { useState, type FormEvent } from 'react'
import { findChat, useChatStore } from '@/entities/chat'
import { isValidPhone, normalizePhone, phoneToChatId } from '@/shared/lib'
import { Button, Input, Modal } from '@/shared/ui'
import styles from './CreateChatModal.module.css'

export function CreateChatModal({ onClose }: { onClose: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const phone = normalizePhone(value)
    if (!isValidPhone(phone)) {
      setError('Введите номер в международном формате, например +7 999 123-45-67')
      return
    }

    const { chats, addChat, setActiveChat } = useChatStore.getState()
    const existing = findChat(chats, { phone })
    if (existing) {
      setActiveChat(existing.id)
    } else {
      addChat({ id: phone, phone, chatId: phoneToChatId(phone), createdAt: Date.now() })
      setActiveChat(phone)
    }
    onClose()
  }

  return (
    <Modal title="Новый чат" onClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          label="Номер телефона получателя"
          placeholder="+7 999 123-45-67"
          type="tel"
          inputMode="tel"
          value={value}
          error={error}
          onChange={(event) => {
            setValue(event.target.value)
            setError(undefined)
          }}
          autoFocus
        />
        <Button type="submit" fullWidth disabled={!value.trim()}>
          Создать чат
        </Button>
      </form>
    </Modal>
  )
}
