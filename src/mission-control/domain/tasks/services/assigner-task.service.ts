import { Injectable } from '@nestjs/common'

import { MessageException } from '@adapters/message-broker/types'
import { Task } from 'src/mission-control/prisma/generated/mission-control'

import { TaskCreationConsumer } from '../messaging/task-queue'
import { TaskRepository } from '../repositories/task-repositoriy'
import { TaskScope } from '../types'
import { TaskAssigner } from '../use-cases/assign-task/base-scenario/task-assigner.abstract'

const TASK_QUEUE_NAME = 'task-creation'

@Injectable()
export class TaskAssignerService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly consumer: TaskCreationConsumer,
    private readonly assigners: TaskAssigner[],
  ) {}

  async execute() {
    this.consumer.consume(
      TASK_QUEUE_NAME,
      async (exception: MessageException, scope: TaskScope) => {
        const assignPromises: Array<Promise<Task[]>> = this.assigners.map(async (assigner) => {
          try {
            return await assigner.assign(scope)
          } catch (error: unknown) {
            console.error(
              `${exception.code} failed to assign tasks for ${scope.userId} in ${scope.teamId} for ${scope.weekId} with ${assigner.constructor.name}:`,
              error,
            )

            console.error(`Error description: ${exception.message}`)
          }
        })

        const assignedTaskArrays = await Promise.all(assignPromises)
        const tasks = assignedTaskArrays.flat()

        await this.taskRepository.createMany(tasks)
      },
    )
  }
}
