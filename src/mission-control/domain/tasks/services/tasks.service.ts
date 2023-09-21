import { Injectable } from '@nestjs/common'

import { Stopwatch } from '@lib/logger/pino.decorator'
import { Task } from '@prisma/mission-control/generated'

import { TaskRepository } from '../repositories/task-repositoriy'

@Injectable()
class TasksService {
  constructor(private readonly taskRepository: TaskRepository) {}

  @Stopwatch()
  public async getUserTasks(userId: string, teamId: string): Promise<Task[]> {
    return this.taskRepository.findMany({ userId, teamId })
  }
}

export default TasksService
