import { EmailData } from '@adapters/email/types/data.type'
import { EmailMetadata } from '@adapters/email/types/metadata.type'

export interface EmailProviderInterface {
  send: (data: EmailData, metadata: EmailMetadata) => Promise<void>
}
