import { useCallback, useState } from 'react'
import { Icon } from '@/shared/ui'
import { CreateChatModal } from './CreateChatModal'
import styles from './CreateChatButton.module.css'

export function CreateChatButton() {
  const [isOpen, setIsOpen] = useState(false)
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <>
      <button
        className={styles.button}
        onClick={() => setIsOpen(true)}
        title="Новый чат"
        aria-label="Новый чат"
      >
        <Icon name="edit" size={20} />
      </button>
      {isOpen && <CreateChatModal onClose={close} />}
    </>
  )
}
