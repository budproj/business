import { Injectable, Logger } from '@nestjs/common'

import { Stopwatch } from '@lib/logger/pino.decorator'

import { buildWeekId } from '../../../helpers/build-week-id'
import { TaskCreationProducer } from '../messaging/task-queue.js'
import { CoreDomainRepository } from '../repositories/core-domain-repository'

@Injectable()
export class TaskPlannerService {
  private readonly logger = new Logger(TaskPlannerService.name)

  constructor(
    private readonly producer: TaskCreationProducer,
    private readonly coreDomainRepository: CoreDomainRepository,
  ) {}

  @Stopwatch()
  async execute() {
    const weekId = buildWeekId()
    this.logger.log(`Planning tasks for week ${weekId}`)

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
        count++
      }
    }

    return count
  }
}
