import { Injectable } from '@nestjs/common'

import { Task } from '@prisma/mission-control/generated'
import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'
import { TaskId } from 'src/mission-control/domain/tasks/types'

import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(taskId: Partial<TaskId>): Promise<Task[]> {
    return this.prisma.task.findMany({ where: taskId })
  }

  async addSubtask(taskId: TaskId, stepId: string): Promise<void> {
    try {
      await this.prisma.task.update({
        where: {
          companyId_userId_teamId_weekId_templateId: { ...taskId },
        },
        data: { completedSubtasks: { push: stepId }, availableSubtasks: { push: stepId } },
      })
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      console.error(`\n\n\n erro ao adicionar subtask: ${error} \n\n\n`)
    }
  }

  async createMany(tasks: Task[]): Promise<void> {
    try {
      await this.prisma.task.createMany({ data: tasks })
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      console.error(`\n\n\n erro ao criar task: ${error} \n\n\n`)
    }
  }
}
