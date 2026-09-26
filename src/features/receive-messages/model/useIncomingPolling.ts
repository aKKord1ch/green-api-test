import { useEffect, useState } from 'react'
import { useCredentials } from '@/entities/session'
import { greenApi, GreenApiError, type Notification } from '@/shared/api'
import { POLLING_RETRY_DELAY_MS, RECEIVE_TIMEOUT_SEC } from '@/shared/config'
import { parseIncomingText } from '../lib/parseNotification'
import { handleIncomingMessage } from './handleIncomingMessage'

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      resolve()
    })
  })
}

function processNotification({ body }: Notification) {
  try {
    const message = parseIncomingText(body)
    if (message) handleIncomingMessage(message)
  } catch (error) {
    // Битое уведомление не должно блокировать очередь — логируем и удаляем.
    console.error('Не удалось обработать уведомление', body, error)
  }
}

/**
 * Получение входящих через HTTP API: receiveNotification (long-poll) →
 * обработка → deleteNotification. Работает, пока пользователь авторизован.
 * Возвращает текст ошибки соединения (или null).
 */
export function useIncomingPolling() {
  const credentials = useCredentials()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!credentials) return
    const controller = new AbortController()
    const { signal } = controller

    const poll = async () => {
      while (!signal.aborted) {
        try {
          const notification = await greenApi.receiveNotification(
            credentials,
            RECEIVE_TIMEOUT_SEC,
            signal,
          )
          if (notification) {
            processNotification(notification)
            await greenApi.deleteNotification(credentials, notification.receiptId, signal)
          }
          setError(null)
        } catch (err) {
          if (signal.aborted) return
          setError(
            err instanceof GreenApiError ? err.message : 'Нет соединения с GREEN-API',
          )
          await delay(POLLING_RETRY_DELAY_MS, signal)
        }
      }
    }

    void poll()
    return () => controller.abort()
  }, [credentials])

  return { error }
}
