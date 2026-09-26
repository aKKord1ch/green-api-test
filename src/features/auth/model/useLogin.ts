import { useState } from 'react'
import { useSessionStore } from '@/entities/session'
import { greenApi, GreenApiError, type Credentials } from '@/shared/api'

const STATE_MESSAGES: Record<string, string> = {
  notAuthorized: 'Инстанс не авторизован — отсканируйте QR-код в личном кабинете GREEN-API',
  blocked: 'Инстанс заблокирован',
  starting: 'Инстанс запускается, попробуйте через пару минут',
  yellowCard: 'Отправка сообщений временно ограничена (yellowCard)',
  sleepMode: 'Инстанс в спящем режиме',
}

function toErrorMessage(error: unknown, apiUrl: string): string {
  if (error instanceof GreenApiError) return error.message
  return `Не удалось подключиться к ${apiUrl}. Проверьте apiUrl и интернет-соединение`
}

/** Настройки, без которых HTTP API не будет получать входящие сообщения. */
function hasReceivingIssue(settings: { webhookUrl?: string; incomingWebhook?: string }) {
  return Boolean(settings.webhookUrl) || settings.incomingWebhook !== 'yes'
}

export function useLogin() {
  const login = useSessionStore((state) => state.login)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [settingsIssue, setSettingsIssue] = useState(false)

  const submit = async (credentials: Credentials) => {
    setLoading(true)
    setError(null)
    setSettingsIssue(false)
    try {
      const { stateInstance } = await greenApi.getStateInstance(credentials)
      if (stateInstance !== 'authorized') {
        setError(STATE_MESSAGES[stateInstance] ?? `Состояние инстанса: ${stateInstance}`)
        return
      }
      const settings = await greenApi.getSettings(credentials)
      if (hasReceivingIssue(settings)) {
        setSettingsIssue(true)
        return
      }
      login(credentials)
    } catch (err) {
      setError(toErrorMessage(err, credentials.apiUrl))
    } finally {
      setLoading(false)
    }
  }

  /** Очищает webhookUrl и включает входящие уведомления, затем входит. */
  const fixSettingsAndLogin = async (credentials: Credentials) => {
    setLoading(true)
    setError(null)
    try {
      await greenApi.setSettings(credentials, { webhookUrl: '', incomingWebhook: 'yes' })
      setSettingsIssue(false)
      login(credentials)
    } catch (err) {
      setError(toErrorMessage(err, credentials.apiUrl))
    } finally {
      setLoading(false)
    }
  }

  return { submit, fixSettingsAndLogin, loading, error, settingsIssue }
}
