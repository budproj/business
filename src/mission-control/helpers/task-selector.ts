import { Task } from '@prisma/mission-control/generated'

const MAX_TASKS_PER_SCOPE = 3

export const TaskSelector = (tasks: Task[]) =>
  tasks
    .sort(
      (left, right) =>
        right.availableSubtasks.length * right.score - left.availableSubtasks.length * left.score,
    )
    .slice(0, MAX_TASKS_PER_SCOPE)
