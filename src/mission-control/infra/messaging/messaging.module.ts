import { SQSClient } from '@aws-sdk/client-sqs'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { SqsModule } from '@ssut/nestjs-sqs'

import { AWSConfigModule } from '@config/aws/aws.module'
import { AWSConfigProvider } from '@config/aws/aws.provider'
import { CoreModule } from '@core/core.module'
import { EventSubscriber } from 'src/mission-control/domain/tasks/messaging/events'
import { TaskCreationProducer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskAssignerService } from 'src/mission-control/domain/tasks/services/assigner-task.service'
import { TaskFulfillerService } from 'src/mission-control/domain/tasks/services/fullfilker-task.service'
import { AssignCheckinTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-checkin-task'
import { AssignCommentOnBarrierKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-comment-on-barrier-kr'
import { AssignCommentOnKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-comment-on-key-result'
import { AssignEmptyDescriptionTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-empty-description-key-result-task'
import { AssignOutdatedKeyResultCommentTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-outdated-key-result-comment-task'
import { AssignCommentOnLowConfidenceKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assingn-comment-on-low-confidence-kr'
import { FulfillCheckinTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fulfil-checkin-task'
import { FulfillCommenBarrierKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-barrier-key-result-task'
import { FulfillCommentOnKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-key-result-task'
import { FulfillCommentOnLowConfidenceKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-low-confidence-key-result-task'
import { FulfillEmptyDescriptionTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-empty-description-task'

import { MissionControlDatabaseModule } from '../database/database.module'
import { PostgresJsService } from '../database/postgresjs/postgresjs.service'
import { HttpModule } from '../http/http.module'
import { SQSTaskCreationProducer } from '../messaging/producers/task-creation.producer'
import { NodeFulfillerTaskSubscriber } from '../messaging/subscribers/fulfiller-task.subscriber'

@Module({
  imports: [
    SqsModule.registerAsync({
      useFactory: async (config: AWSConfigProvider) => {
        const { accessKeyID } = config.credentials
        const { secretAccessKey } = config.credentials
        const SQSInstance = new SQSClient({
          endpoint: config.sqs.endpoint,
          region: config.region,
          credentials: {
            accessKeyId: accessKeyID,
            secretAccessKey,
          },
        })

        const createTaskQueueConfig = {
          name: config.sqs.createTaskQueueName,
          queueUrl: config.sqs.createTaskQueueUrl,
          region: config.region,
          sqs: SQSInstance,
        }

        return {
          consumers: [
            {
              ...createTaskQueueConfig,
              waitTimeSeconds: 20,
              visibilityTimeout: 30,
              terminateVisibilityTimeout: true,
            },
          ],
          producers: [
            {
              ...createTaskQueueConfig,
            },
          ],
        }
      },
      imports: [AWSConfigModule],
      inject: [AWSConfigProvider],
    }),
    AWSConfigModule,
    EventEmitterModule.forRoot(),
    HttpModule,
    MissionControlDatabaseModule,
    CoreModule,
  ],
  providers: [
    PostgresJsService,
    SQSTaskCreationProducer,
    TaskAssignerService,
    AssignCheckinTask,
    AssignEmptyDescriptionTask,
    AssignCommentOnKeyResultTask,
    AssignCommentOnLowConfidenceKeyResultTask,
    AssignCommentOnBarrierKeyResultTask,
    AssignOutdatedKeyResultCommentTask,
    TaskFulfillerService,
    FulfillCheckinTask,
    FulfillEmptyDescriptionTask,
    FulfillCommentOnKeyResultTask,
    FulfillCommenBarrierKeyResultTask,
    FulfillCommentOnLowConfidenceKeyResultTask,
    { provide: TaskCreationProducer, useClass: SQSTaskCreationProducer },
    { provide: EventSubscriber, useClass: NodeFulfillerTaskSubscriber },
  ],
  exports: [
    SQSTaskCreationProducer,
    TaskAssignerService,
    AssignCheckinTask,
    AssignEmptyDescriptionTask,
    AssignCommentOnKeyResultTask,
    AssignCommentOnLowConfidenceKeyResultTask,
    AssignCommentOnBarrierKeyResultTask,
    AssignOutdatedKeyResultCommentTask,
    TaskCreationProducer,
    EventSubscriber,
  ],
})
export class MessagingModule {}
