import { Module } from '@nestjs/common'

import { TaskCreationConsumer } from 'src/mission-control/domain/tasks/messaging/task-queue'

import { SQSTaskCreationConsumer } from './consumers/task-consumer'

@Module({
  providers: [{ provide: TaskCreationConsumer, useClass: SQSTaskCreationConsumer }],
  exports: [TaskCreationConsumer],
})
export class MissionControlSQSModule {}
