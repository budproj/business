import { Injectable, Logger } from '@nestjs/common'
import { SQS } from 'aws-sdk'
import { InjectAwsService } from 'nest-aws-sdk'

import { MessageBrokerInterface } from '@adapters/message-broker/interface/message-broker.interface'
import { Handler } from '@adapters/message-broker/types'
import { AWSSQSConfigInterface } from '@config/aws/aws.interface'
import { AWSConfigProvider } from '@config/aws/aws.provider'

@Injectable()
export class AWSSQSProvider implements MessageBrokerInterface {
  private readonly logger = new Logger(AWSSQSProvider.name)
  private readonly config: AWSSQSConfigInterface

  constructor(
    @InjectAwsService(SQS)
    private readonly remote: SQS,
    awsConfig: AWSConfigProvider,
  ) {
    this.config = awsConfig.sqs
  }

  public async send(queue: string, data: string): Promise<void> {
    this.remote.sendMessage({ QueueUrl: queue, MessageBody: data })

    this.logger.debug({
      message: `Send message ${data} from queue ${queue}`,
    })
  }

  public async receive(queue: string, handler: Handler): Promise<void> {
    this.remote.receiveMessage({ QueueUrl: queue }, handler)

    this.logger.debug({
      message: `Receive message from ${queue}`,
    })
  }
}
