export const DEFAULT_API_URL = 'https://api.green-api.com'

/** Сколько секунд сервер держит long-poll запрос receiveNotification (5–60). */
export const RECEIVE_TIMEOUT_SEC = 20

/** Пауза перед повтором опроса после сетевой ошибки. */
export const POLLING_RETRY_DELAY_MS = 5000

export const MAX_MESSAGE_LENGTH = 4000
