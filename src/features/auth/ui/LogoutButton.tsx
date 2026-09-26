import { useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { useSessionStore } from '@/entities/session'
import { Icon } from '@/shared/ui'
import styles from './LogoutButton.module.css'

export function LogoutButton() {
  const handleLogout = () => {
    useChatStore.getState().reset()
    useMessageStore.getState().reset()
    useSessionStore.getState().logout()
  }

  return (
    <button className={styles.button} onClick={handleLogout} title="Выйти" aria-label="Выйти">
      <Icon name="logout" />
    </button>
  )
}
