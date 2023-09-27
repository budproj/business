import { Message } from '@aws-sdk/client-sqs'
import { Injectable, Logger } from '@nestjs/common'
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs'

import { Stopwatch } from '@lib/logger/pino.decorator'
import { Task } from '@prisma/mission-control/generated'
import { TaskSelector } from 'src/mission-control/helpers/task-selector'

import { TaskRepository } from '../repositories/task-repositoriy'
import { TaskScope } from '../types'
import { AssignCommentOnBarrierKeyResultTask } from '../use-cases/assign-task/assign-comment-on-barrier-kr'
import { AssignCommentOnLowConfidenceKeyResultTask } from '../use-cases/assign-task/assingn-comment-on-low-confidence-kr'

@Injectable()
export class TaskAssignerService {
  private readonly logger = new Logger(TaskAssignerService.name)

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly assignCommentOnLowConfidenceKeyResultTask: AssignCommentOnLowConfidenceKeyResultTask,
    private readonly assignCommentOnBarrierKeyResultTask: AssignCommentOnBarrierKeyResultTask,
  ) {}

  @Stopwatch()
  @SqsMessageHandler(process.env.AWS_SQS_CREATE_TASK_QUEUE_NAME, false)
  public async handleMessage(message: AWS.SQS.Message) {
    this.logger.log({
      message: 'Received message from SQS',
      body: message.Body,
    })

    try {
      const { scope } = JSON.parse(message.Body)
      await this.assignTasks(scope)
    } catch (error: unknown) {
      throw new Error(`Failed to receive and process message from SQS: ${JSON.stringify(error)}`)
    }
  }

  @Stopwatch({ includeReturn: true })
  @SqsConsumerEventHandler(process.env.AWS_SQS_CREATE_TASK_QUEUE_NAME, 'processing_error')
  public onProcessingError(message: Message) {
    this.logger.log({
      message: `Failed to process from SQS: ${JSON.stringify(message)}`,
      body: message.Body,
    })
  }

  async assignTasks(scope: TaskScope) {
    const assigners = [
      this.assignCommentOnBarrierKeyResultTask,
      this.assignCommentOnLowConfidenceKeyResultTask,
    ]

    const tasks: Task[] = []

    for (const assigner of assigners) {
      // eslint-disable-next-line no-await-in-loop
      const assignedTasks = await assigner.assign(scope)
      if (assignedTasks.length > 0) tasks.push(...assignedTasks)
    }

    const selectedTasks = TaskSelector(tasks)

    if (selectedTasks.length > 0) {
      await this.taskRepository.createMany(selectedTasks)
    }
  }
}
