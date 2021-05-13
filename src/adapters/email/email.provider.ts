import { EmailProviderInterface } from '@adapters/email/interface/provider.interface'
import { EmailData } from '@adapters/email/types/data.type'
import { EmailMetadata } from '@adapters/email/types/metadata.type'

export class EmailAdapterProvider {
  constructor(private readonly provider: EmailProviderInterface) {}

  public async send(data: EmailData, metadata: EmailMetadata): Promise<void> {
    return this.provider.send(data, metadata)
  }
}
