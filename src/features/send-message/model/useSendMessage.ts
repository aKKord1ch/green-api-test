import { useCallback } from 'react'
import type { Chat } from '@/entities/chat'
import { useMessageStore } from '@/entities/message'
import { useCredentials } from '@/entities/session'
import { greenApi } from '@/shared/api'

export function useSendMessage(chat: Chat) {
  const credentials = useCredentials()

  return useCallback(
    async (text: string) => {
      if (!credentials) return
      const { addMessage, updateMessage } = useMessageStore.getState()
      const id = crypto.randomUUID()

      addMessage(chat.id, {
        id,
        text,
        direction: 'outgoing',
        timestamp: Date.now(),
        status: 'sending',
      })

      try {
        const { idMessage } = await greenApi.sendMessage(credentials, chat.chatId, text)
        updateMessage(chat.id, id, { idMessage, status: 'sent' })
      } catch {
        updateMessage(chat.id, id, { status: 'error' })
      }
    },
    [credentials, chat.id, chat.chatId],
  )
}
