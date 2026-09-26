export type MessageDirection = 'incoming' | 'outgoing'
export type MessageStatus = 'sending' | 'sent' | 'error'

export interface Message {
  /** Локальный id (для исходящих до ответа сервера) или idMessage из GREEN-API. */
  id: string
  /** idMessage, присвоенный GREEN-API. */
  idMessage?: string
  text: string
  direction: MessageDirection
  timestamp: number
  status: MessageStatus
}
