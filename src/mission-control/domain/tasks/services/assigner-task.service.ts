import { Injectable } from '@nestjs/common'

import { Task } from '@prisma/mission-control/generated'

import { TaskCreationConsumer } from '../messaging/task-queue'
import { TaskRepository } from '../repositories/task-repositoriy'
import { TaskScope } from '../types'
import { AssignCheckinTask } from '../use-cases/assign-task/assign-checkin-task'

@Injectable()
export class TaskAssignerService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly consumer: TaskCreationConsumer,
    private readonly assignCheckInTask: AssignCheckinTask,
  ) {}

  async execute() {
    const assigners = [this.assignCheckInTask]

    this.consumer.consume(async (scope: TaskScope) => {
      const tasksToInsert: Task[] = []

      const assignPromises = assigners.map(async (assigner) => {
        try {
          const assignedTasks = await assigner.assign(scope)
          if (assignedTasks) tasksToInsert.push(...assignedTasks)
        } catch (error: unknown) {
          console.error(
            `Failed to assign tasks for ${scope.userId} in ${scope.teamId} for ${scope.weekId} with ${assigner.constructor.name}:`,
            error,
          )
        }
      })

      await Promise.all(assignPromises)

      if (tasksToInsert.length > 0) {
        await this.taskRepository.createMany(tasksToInsert)
      }
    })
  }
}
