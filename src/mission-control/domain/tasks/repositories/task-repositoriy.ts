import { Task } from 'src/mission-control/prisma/generated/mission-control'

import { TaskId } from '../types'

export abstract class TaskRepository {
  abstract createMany(tasks: Task[]): Promise<void>
  abstract findMany(taskId: Partial<TaskId>): Promise<Task[]>
  abstract addSubtask(taskId: TaskId, stepId: string): Promise<void>
}
