import { LoginForm } from '@/features/auth'
import { Icon } from '@/shared/ui'
import styles from './LoginPage.module.css'

export function LoginPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo} aria-hidden>
          <Icon name="send" size={32} />
        </div>
        <h1 className={styles.title}>Вход в Telegram Chat</h1>
        <p className={styles.subtitle}>
          Введите данные инстанса из{' '}
          <a href="https://console.green-api.com" target="_blank" rel="noreferrer">
            личного кабинета GREEN-API
          </a>
        </p>
        <LoginForm />
      </div>
    </main>
  )
}
