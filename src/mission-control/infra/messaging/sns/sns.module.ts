import { Module } from '@nestjs/common'

import { EventSubscriber } from 'src/mission-control/domain/tasks/messaging/events'

import { SNSFulfillerTaskSubscribe } from './subscribe/fulfiller-task-subscribe'

@Module({
  providers: [{ provide: EventSubscriber, useClass: SNSFulfillerTaskSubscribe }],
  exports: [EventSubscriber],
})
export class MissionControlSNSModule {}
