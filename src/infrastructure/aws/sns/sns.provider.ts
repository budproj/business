import { Injectable, Logger } from '@nestjs/common'
import { SNS } from 'aws-sdk'
import { InjectAwsService } from 'nest-aws-sdk'

import { MessageBrokerInterface } from '@adapters/message-broker/interface/message-broker.interface'
import { Handler } from '@adapters/message-broker/types'
import { AWSSNSConfigInterface } from '@config/aws/aws.interface'
import { AWSConfigProvider } from '@config/aws/aws.provider'

@Injectable()
export class AWSSNSProvider implements MessageBrokerInterface {
  private readonly logger = new Logger(AWSSNSProvider.name)
  private readonly config: AWSSNSConfigInterface

  constructor(
    @InjectAwsService(SNS)
    private readonly remote: SNS,
    awsConfig: AWSConfigProvider,
  ) {
    this.config = awsConfig.sns
  }

  public async send(topic: string, data: string): Promise<void> {
    this.remote.publish({ TopicArn: topic, Message: data })

    this.logger.debug({
      message: `Send message ${data} from topic ${topic}`,
    })
  }

  public async receive(topic: string, handler: Handler, protocol: string): Promise<void> {
    this.remote.subscribe({ TopicArn: topic, Protocol: protocol }, handler)

    this.logger.debug({
      message: `Receive message from ${topic}`,
    })
  }
}
