import type { NotificationBody } from '@/shared/api'
import { normalizePhone } from '@/shared/lib'

export interface IncomingTextMessage {
  idMessage: string
  chatId: string
  phone?: string
  senderName?: string
  text: string
  timestamp: number
}

/** Групповые чаты MAX имеют отрицательный chatId, WhatsApp-подобные — суффикс @g.us. */
function isGroupChat(chatId: string) {
  return chatId.startsWith('-') || chatId.endsWith('@g.us')
}

/**
 * Возвращает входящее текстовое сообщение из личного чата,
 * либо null для всех остальных типов уведомлений.
 */
export function parseIncomingText(body: NotificationBody): IncomingTextMessage | null {
  if (body.typeWebhook !== 'incomingMessageReceived') return null

  const { senderData, messageData, idMessage } = body
  if (!senderData?.chatId || !messageData || !idMessage) return null
  if (isGroupChat(senderData.chatId)) return null

  let text: string | undefined
  if (messageData.typeMessage === 'textMessage') {
    text = messageData.textMessageData?.textMessage
  } else if (messageData.typeMessage === 'extendedTextMessage') {
    text = messageData.extendedTextMessageData?.text
  }
  if (!text) return null

  const phone = senderData.senderPhoneNumber
    ? normalizePhone(String(senderData.senderPhoneNumber))
    : senderData.chatId.endsWith('@c.us')
      ? normalizePhone(senderData.chatId)
      : undefined

  return {
    idMessage,
    chatId: senderData.chatId,
    phone,
    senderName: senderData.senderName || senderData.chatName || undefined,
    text,
    timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
  }
}
