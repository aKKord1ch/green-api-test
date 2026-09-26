import { findChat, useChatStore } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import type { IncomingTextMessage } from '../lib/parseNotification'

/**
 * Кладёт входящее сообщение в нужный чат.
 * В MAX ответ приходит с числовым chatId, а чат создавался по номеру телефона,
 * поэтому сопоставляем по senderPhoneNumber и запоминаем настоящий chatId.
 */
export function handleIncomingMessage(message: IncomingTextMessage) {
  const { chats, addChat, updateChat } = useChatStore.getState()
  let chat = findChat(chats, { phone: message.phone, chatId: message.chatId })

  if (!chat) {
    chat = {
      id: message.phone ?? message.chatId,
      phone: message.phone,
      chatId: message.chatId,
      name: message.senderName,
      createdAt: Date.now(),
    }
    addChat(chat)
  } else if (chat.chatId !== message.chatId || (!chat.name && message.senderName)) {
    updateChat(chat.id, {
      chatId: message.chatId,
      phone: chat.phone ?? message.phone,
      name: chat.name ?? message.senderName,
    })
  }

  useMessageStore.getState().addMessage(chat.id, {
    id: message.idMessage,
    idMessage: message.idMessage,
    text: message.text,
    direction: 'incoming',
    timestamp: message.timestamp,
    status: 'sent',
  })
}
