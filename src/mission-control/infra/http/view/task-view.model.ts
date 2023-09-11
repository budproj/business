import { Task } from '@prisma/mission-control/generated'

export const TaskViewModel = {
  toHTTP: (tasks: Task[]) =>
    tasks.map((task) => ({
      companyId: task.companyId,
      userId: task.userId,
      weekId: task.weekId,
      templateId: task.templateId,
      score: task.score,
      status: task.completedSubtasks.length === task.availableSubtasks.length,
    })),
}
