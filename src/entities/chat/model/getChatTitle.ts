import { formatPhone } from '@/shared/lib'
import type { Chat } from './types'

export function getChatTitle(chat: Chat): string {
  if (chat.name) return chat.name
  if (chat.phone) return formatPhone(chat.phone)
  return chat.chatId
}
