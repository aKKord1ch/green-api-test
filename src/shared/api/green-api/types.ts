export interface Credentials {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

export type InstanceState =
  | 'authorized'
  | 'notAuthorized'
  | 'blocked'
  | 'starting'
  | 'yellowCard'
  | 'sleepMode'

export interface StateInstanceResponse {
  stateInstance: InstanceState
}

export interface InstanceSettings {
  webhookUrl: string
  incomingWebhook: 'yes' | 'no'
  outgoingWebhook: 'yes' | 'no'
  [key: string]: unknown
}

export interface SendMessageResponse {
  idMessage: string
}

export interface SenderData {
  chatId: string
  sender: string
  senderName?: string
  chatName?: string
  senderPhoneNumber?: number | string
}

export interface MessageData {
  typeMessage: string
  textMessageData?: { textMessage: string }
  extendedTextMessageData?: { text: string }
}

export interface NotificationBody {
  typeWebhook: string
  timestamp: number
  idMessage?: string
  senderData?: SenderData
  messageData?: MessageData
}

export interface Notification {
  receiptId: number
  body: NotificationBody
}
