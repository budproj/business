import { Task } from '@prisma/mission-control/generated'

export const TaskViewModel = {
  toHTTP: (tasks: Task[]) =>
    tasks.map((task) => ({
      userId: task.userId,
      weekId: task.weekId,
      score: task.score,
      templateId: task.templateId,
      completed: task.completedSubtasks.length === task.availableSubtasks.length,
    })),
}
