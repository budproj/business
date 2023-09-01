import { Injectable, Logger } from '@nestjs/common'

import { Task } from '@prisma/mission-control/generated'

import { TaskRepository } from '../repositories/task-repositoriy'

@Injectable()
class TasksService {
  private readonly logger = new Logger(TasksService.name)

  constructor(private readonly taskRepository: TaskRepository) {}

  public async getUserTasks(userId: string, teamId: string): Promise<Task[]> {
    return this.taskRepository.findMany({ userId, teamId })
  }
}

export default TasksService
