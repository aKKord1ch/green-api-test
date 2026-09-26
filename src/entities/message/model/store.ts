import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Message } from './types'

const EMPTY: Message[] = []

interface MessageState {
  /** Сообщения, сгруппированные по Chat.id. */
  byChat: Record<string, Message[]>
  addMessage: (chatKey: string, message: Message) => void
  updateMessage: (chatKey: string, id: string, patch: Partial<Omit<Message, 'id'>>) => void
  reset: () => void
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      byChat: {},
      addMessage: (chatKey, message) =>
        set((state) => {
          const messages = state.byChat[chatKey] ?? EMPTY
          const isDuplicate = messages.some(
            (item) =>
              item.id === message.id ||
              (message.idMessage !== undefined && item.idMessage === message.idMessage),
          )
          if (isDuplicate) return state
          return { byChat: { ...state.byChat, [chatKey]: [...messages, message] } }
        }),
      updateMessage: (chatKey, id, patch) =>
        set((state) => ({
          byChat: {
            ...state.byChat,
            [chatKey]: (state.byChat[chatKey] ?? EMPTY).map((message) =>
              message.id === id ? { ...message, ...patch } : message,
            ),
          },
        })),
      reset: () => set({ byChat: {} }),
    }),
    {
      name: 'max-chat:messages',
      // Сообщения, «зависшие» в отправке при перезагрузке страницы, считаем неотправленными.
      merge: (persisted, current) => {
        const byChat = (persisted as Partial<MessageState> | undefined)?.byChat ?? {}
        const fixed = Object.fromEntries(
          Object.entries(byChat).map(([key, messages]) => [
            key,
            messages.map((m) => (m.status === 'sending' ? { ...m, status: 'error' as const } : m)),
          ]),
        )
        return { ...current, byChat: fixed }
      },
    },
  ),
)

export const useChatMessages = (chatKey: string | null | undefined) =>
  useMessageStore((state) => (chatKey ? (state.byChat[chatKey] ?? EMPTY) : EMPTY))
