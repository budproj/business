import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { buildWeekId } from '../../../helpers/build-week-id'
import { TaskCreationProducer } from '../messaging/task-queue.js'
import { CoreDomainRepository } from '../repositories/core-domain-repository'

@Injectable()
export class TaskPlannerService {
  constructor(
    private readonly producer: TaskCreationProducer,
    private readonly coreDomainRepository: CoreDomainRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute() {
    const weekId = buildWeekId()

    const users = await this.coreDomainRepository.findAllUsersAndTeams()

    let count = 0

    for (const user of users) {
      for (const teamId of user.teamIds) {
        // eslint-disable-next-line no-await-in-loop
        await this.producer.produce({
          userId: user.userId,
          teamId,
          weekId,
        })
        this.eventEmitter.emit('task.create')
        count++
      }
    }

    return count
  }
}
