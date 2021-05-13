import { EmailProviderInterface } from '@adapters/email/interface/email-provider.interface'

export class EmailAdapterProvider {
  constructor(private readonly provider: EmailProviderInterface) {}

  public async send(): Promise<void> {
    return this.provider.send()
  }
}
