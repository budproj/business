import { Injectable } from '@nestjs/common'

import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'
import { TaskId } from 'src/mission-control/domain/tasks/types'
import { Task } from 'src/mission-control/prisma/generated/mission-control'

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
