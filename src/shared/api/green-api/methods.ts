import { request } from './client'
import type {
  Credentials,
  InstanceSettings,
  Notification,
  SendMessageResponse,
  StateInstanceResponse,
} from './types'

export function getStateInstance(credentials: Credentials) {
  return request<StateInstanceResponse>(credentials, 'getStateInstance')
}

export function getSettings(credentials: Credentials) {
  return request<InstanceSettings>(credentials, 'getSettings')
}

export function setSettings(credentials: Credentials, settings: Partial<InstanceSettings>) {
  return request<{ saveSettings: boolean }>(credentials, 'setSettings', {
    method: 'POST',
    body: settings,
  })
}

/** https://green-api.com/v3/docs/api/sending/SendMessage/ */
export function sendMessage(credentials: Credentials, chatId: string, message: string) {
  return request<SendMessageResponse>(credentials, 'sendMessage', {
    method: 'POST',
    body: { chatId, message },
  })
}

/**
 * https://green-api.com/v3/docs/api/receiving/technology-http-api/ReceiveNotification/
 * Long-poll: возвращает null, если за receiveTimeout секунд уведомлений не пришло.
 */
export function receiveNotification(
  credentials: Credentials,
  receiveTimeout: number,
  signal?: AbortSignal,
) {
  return request<Notification | null>(credentials, 'receiveNotification', {
    query: { receiveTimeout },
    signal,
  })
}

/** https://green-api.com/v3/docs/api/receiving/technology-http-api/DeleteNotification/ */
export function deleteNotification(credentials: Credentials, receiptId: number, signal?: AbortSignal) {
  return request<{ result: boolean }>(credentials, 'deleteNotification', {
    method: 'DELETE',
    pathSuffix: String(receiptId),
    signal,
  })
}
