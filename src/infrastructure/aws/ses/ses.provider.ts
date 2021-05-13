import { Injectable, Logger } from '@nestjs/common'
import { SES } from 'aws-sdk'
import { SendTemplatedEmailRequest } from 'aws-sdk/clients/ses'
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

  public async send(data: EmailData, metadata: EmailMetadata): Promise<void> {
    const parameters = this.buildTemplateEmailParams(data, metadata)

    this.logger.debug({
      parameters,
      message: 'Sending e-mail with AWS SES',
    })

    await this.remote.sendTemplatedEmail(parameters).promise()
  }

  private buildTemplateEmailParams(
    data: EmailData,
    metadata: EmailMetadata,
  ): SendTemplatedEmailRequest {
    return {
      Source: this.config.sourceEmail,
      Destination: {
        ToAddresses: metadata.recipients,
      },
      Template: metadata.template,
      TemplateData: JSON.stringify(data),
    }
  }
}
