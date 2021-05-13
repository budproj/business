import { Injectable } from '@nestjs/common'
import { SES } from 'aws-sdk'
import { SendEmailRequest } from 'aws-sdk/clients/ses'
import { InjectAwsService } from 'nest-aws-sdk'

import { EmailProviderInterface } from '@adapters/email/interface/email-provider.interface'
import { AWSSESConfigInterface } from '@config/aws/aws.interface'
import { AWSConfigProvider } from '@config/aws/aws.provider'

@Injectable()
export class AWSSESProvider implements EmailProviderInterface {
  private readonly config: AWSSESConfigInterface
  private readonly urlPrefix: string

  constructor(
    @InjectAwsService(SES)
    private readonly remote: SES,
    awsConfig: AWSConfigProvider,
  ) {
    this.config = awsConfig.ses
  }

  public async send(): Promise<void> {
    const parameters = this.buildEmailParams()

    await this.remote.sendEmail(parameters).promise()
  }

  private buildEmailParams(): SendEmailRequest {
    return {
      Source: this.config.sourceEmail,
      Destination: {
        ToAddresses: ['delucca@pm.me'],
      },
      Message: {
        Body: {
          Text: {
            Charset: 'UTF-8',
            Data: 'teste',
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email',
        },
      },
    }
  }
}
