import { useState, type FormEvent } from 'react'
import type { Credentials } from '@/shared/api'
import { DEFAULT_API_URL } from '@/shared/config'
import { Button, Input } from '@/shared/ui'
import { useLogin } from '../model/useLogin'
import styles from './LoginForm.module.css'

export function LoginForm() {
  const { submit, fixSettingsAndLogin, loading, error, settingsIssue } = useLogin()
  const [form, setForm] = useState<Credentials>({
    apiUrl: DEFAULT_API_URL,
    idInstance: '',
    apiTokenInstance: '',
  })

  const update = (field: keyof Credentials) => (event: { target: { value: string } }) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void submit(form)
  }

  const canSubmit = form.apiUrl.trim() && form.idInstance.trim() && form.apiTokenInstance.trim()

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="idInstance"
        placeholder="3100000001"
        inputMode="numeric"
        autoComplete="username"
        value={form.idInstance}
        onChange={update('idInstance')}
        autoFocus
      />
      <Input
        label="apiTokenInstance"
        type="password"
        placeholder="d75b3a66374942c5b3c019c698abc2067e151558acbd412345"
        autoComplete="current-password"
        value={form.apiTokenInstance}
        onChange={update('apiTokenInstance')}
      />
      <Input
        label="apiUrl"
        placeholder={DEFAULT_API_URL}
        hint="Указан в личном кабинете GREEN-API на странице инстанса"
        value={form.apiUrl}
        onChange={update('apiUrl')}
      />

      {error && <div className={styles.error}>{error}</div>}

      {settingsIssue ? (
        <div className={styles.warning}>
          <p>
            В настройках инстанса задан <code>webhookUrl</code> или выключены входящие
            уведомления — в таком режиме чат не сможет получать ответы через HTTP API.
          </p>
          <Button type="button" fullWidth loading={loading} onClick={() => fixSettingsAndLogin(form)}>
            Исправить настройки и войти
          </Button>
        </div>
      ) : (
        <Button type="submit" fullWidth loading={loading} disabled={!canSubmit}>
          Войти
        </Button>
      )}
    </form>
  )
}
