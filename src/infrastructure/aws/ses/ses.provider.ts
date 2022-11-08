import { Injectable, Logger } from '@nestjs/common'
import { SES } from 'aws-sdk'
import { BulkEmailDestinationList, SendBulkTemplatedEmailRequest } from 'aws-sdk/clients/ses'
import { InjectAwsService } from 'nest-aws-sdk'

import { EmailProviderInterface } from '@adapters/email/interface/provider.interface'
import { EmailData } from '@adapters/email/types/data.type'
import { EmailMetadata } from '@adapters/email/types/metadata.type'
import { AWSSESConfigInterface } from '@config/aws/aws.interface'
import { AWSConfigProvider } from '@config/aws/aws.provider'

@Injectable()
export class AWSSESProvider implements EmailProviderInterface {
  private readonly logger = new Logger(AWSSESProvider.name)
  private readonly config: AWSSESConfigInterface

  constructor(
    @InjectAwsService(SES)
    private readonly remote: SES,
    awsConfig: AWSConfigProvider,
  ) {
    this.config = awsConfig.ses
  }

  static buildBulkEmailDestinationList(metadata: EmailMetadata): BulkEmailDestinationList {
    return metadata.recipients.map((recipient) => ({
      Destination: {
        ToAddresses: [recipient.address],
      },
      ReplacementTemplateData: JSON.stringify(recipient.customTemplateData),
    }))
  }

  public async send(data: EmailData, metadata: EmailMetadata): Promise<void> {
    const parameters = this.buildTemplateEmailParams(data, metadata)

    this.logger.debug({
      parameters,
      message: 'Sending e-mail with AWS SES',
    })

    try {
      await this.remote.sendBulkTemplatedEmail(parameters).promise()
    } catch (error: unknown) {
      this.logger.error(error)
    }

    this.logger.debug({
      message: 'Email sent',
    })
  }

  private buildTemplateEmailParams(
    data: EmailData,
    metadata: EmailMetadata,
  ): SendBulkTemplatedEmailRequest {
    return {
      Source: this.getNamedSource(),
      Destinations: AWSSESProvider.buildBulkEmailDestinationList(metadata),
      Template: metadata.template,
      DefaultTemplateData: JSON.stringify(data),
      ConfigurationSetName: this.config.debug ? 'Debug' : undefined,
    }
  }

  private getNamedSource() {
    return `"${this.config.source.name}" <${this.config.source.email}>`
  }
}
