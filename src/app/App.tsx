import { useCredentials } from '@/entities/session'
import { ChatPage } from '@/pages/chat'
import { LoginPage } from '@/pages/login'

export function App() {
  const credentials = useCredentials()
  return credentials ? <ChatPage /> : <LoginPage />
}
