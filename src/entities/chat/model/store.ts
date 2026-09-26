import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chat } from './types'

interface ChatState {
  chats: Chat[]
  activeChatId: string | null
  addChat: (chat: Chat) => void
  updateChat: (id: string, patch: Partial<Omit<Chat, 'id'>>) => void
  setActiveChat: (id: string | null) => void
  reset: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChatId: null,
      addChat: (chat) =>
        set((state) =>
          state.chats.some((item) => item.id === chat.id)
            ? state
            : { chats: [chat, ...state.chats] },
        ),
      updateChat: (id, patch) =>
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === id ? { ...chat, ...patch } : chat)),
        })),
      setActiveChat: (activeChatId) => set({ activeChatId }),
      reset: () => set({ chats: [], activeChatId: null }),
    }),
    { name: 'green-api-chat:chats' },
  ),
)

/** Ищет чат по номеру телефона собеседника или по его chatId. */
export function findChat(chats: Chat[], { phone, chatId }: { phone?: string; chatId?: string }) {
  return chats.find(
    (chat) =>
      (phone && chat.phone === phone) || (chatId && (chat.chatId === chatId || chat.id === chatId)),
  )
}

export const useActiveChat = () =>
  useChatStore((state) => state.chats.find((chat) => chat.id === state.activeChatId) ?? null)
