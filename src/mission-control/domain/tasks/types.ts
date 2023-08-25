import { Task } from '@prisma/client'

import { Except } from 'src/mission-control/helpers/except'

export type TaskId = Except<Task, 'score' | 'availableSubtasks' | 'completedSubtasks'>
export type TaskScope = Except<TaskId, 'templateId'>
