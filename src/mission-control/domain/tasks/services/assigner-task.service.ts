import { Injectable } from '@nestjs/common'

import { Task } from '@prisma/mission-control/generated'

import { TaskCreationConsumer } from '../messaging/task-queue'
import { TaskRepository } from '../repositories/task-repositoriy'
import { TaskScope } from '../types'
import { AssignCheckinTask } from '../use-cases/assign-task/assign-checkin-task'
import { AssignCommentOnBarrierKeyResultTask } from '../use-cases/assign-task/assign-comment-on-barrier-kr'
import { AssignCommentOnKeyResultTask } from '../use-cases/assign-task/assign-comment-on-key-result'
import { AssignEmptyDescriptionTask } from '../use-cases/assign-task/assign-empty-description-key-result-task'
import { AssignCommentOnLowConfidenceKeyResultTask } from '../use-cases/assign-task/assingn-comment-on-low-confidence-kr'

@Injectable()
export class TaskAssignerService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly consumer: TaskCreationConsumer,
    private readonly assignCheckInTask: AssignCheckinTask,
    private readonly assignEmptyDescriptionTask: AssignEmptyDescriptionTask,
    private readonly assignCommentOnKeyResultTask: AssignCommentOnKeyResultTask,
    private readonly assignCommentOnLowConfidenceKeyResultTask: AssignCommentOnLowConfidenceKeyResultTask,
    private readonly assignCommentOnBarrierKeyResultTask: AssignCommentOnBarrierKeyResultTask,
  ) {}

  async execute() {
    const assigners = [
      this.assignCheckInTask,
      this.assignEmptyDescriptionTask,
      this.assignCommentOnKeyResultTask,
      this.assignCommentOnLowConfidenceKeyResultTask,
      this.assignCommentOnBarrierKeyResultTask,
    ]

    this.consumer.consume(async (scope: TaskScope) => {
      const tasksToInsert: Task[] = []

      const assignPromises = assigners.map(async (assigner) => {
        try {
          const assignedTasks = await assigner.assign(scope)
          tasksToInsert.push(...assignedTasks)
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
