import { Injectable } from '@nestjs/common'
import { Task } from '@prisma/client'

import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositorie'
import { TaskId } from 'src/mission-control/domain/tasks/types'

import { PrismaService } from '../../prisma.service'

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(taskId: Partial<TaskId>): Promise<Task[]> {
    return this.prisma.task.findMany({ where: taskId })
  }

  async addSubtask(taskId: TaskId, stepId: string): Promise<void> {
    void this.prisma.task.update({
      where: {
        companyId_userId_teamId_weekId_templateId: taskId,
      },
      data: { completedSubtasks: { push: stepId }, availableSubtasks: { push: stepId } },
    })
  }

  async createMany(tasks: Task[]): Promise<void> {
    void this.prisma.task.createMany({ data: tasks })
  }
}
