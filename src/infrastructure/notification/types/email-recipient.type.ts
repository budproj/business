import { Recipient } from './recipient.type'

export type EmailRecipient = Recipient & {
  name: string
  address: string
  customTemplateData?: Record<string, any>
}
