import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { Task } from '@prisma/mission-control/generated'
import { TaskSelector } from 'src/mission-control/helpers/task-selector'

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

  @OnEvent('task.create')
  async execute() {
    const assigners = [
      this.assignCheckInTask,
      this.assignCommentOnBarrierKeyResultTask,
      this.assignCommentOnKeyResultTask,
      this.assignCommentOnLowConfidenceKeyResultTask,
      this.assignEmptyDescriptionTask,
    ]

    this.consumer.consume(async (scope: TaskScope) => {
      const tasks: Task[] = []

      try {
        for (const assigner of assigners) {
          // eslint-disable-next-line no-await-in-loop
          const assignedTasks = await assigner.assign(scope)
          if (assignedTasks.length > 0) tasks.push(...assignedTasks)
        }
      } catch (error: unknown) {
        console.error(
          `Failed to assign tasks for ${scope.userId} in ${scope.teamId} for ${scope.weekId}:`,
          error,
        )
      }

      const selectedTasks = TaskSelector(tasks)

      if (selectedTasks.length > 0) {
        await this.taskRepository.createMany(selectedTasks)
      }
    })
  }
}
