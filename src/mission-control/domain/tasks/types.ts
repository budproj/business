import { Except } from 'src/mission-control/helpers/except'
import { Task } from 'src/mission-control/prisma/generated/mission-control'

export type TaskId = Except<Task, 'score' | 'availableSubtasks' | 'completedSubtasks'>
export type TaskScope = Except<TaskId, 'templateId'>
