import { Task } from '@prisma/mission-control/generated'

import { TaskId } from '../types'

export abstract class TaskRepository {
  abstract createMany(tasks: Task[]): Promise<void>
  abstract findMany(taskId: Partial<TaskId>): Promise<Task[]>
  abstract addSubtask(taskId: TaskId, stepId: string): Promise<void>
  abstract processTeamGoal(teamId: Task['teamId'], weekId: Task['weekId']): Promise<number>
  abstract removeAll(): Promise<void>
}
