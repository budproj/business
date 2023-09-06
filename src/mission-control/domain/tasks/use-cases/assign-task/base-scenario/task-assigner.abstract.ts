import { Task } from '@prisma/mission-control/generated'

import { TaskScope } from '../../../types'

export abstract class TaskAssigner {
  abstract assign(scope: TaskScope): Promise<Task[] | null>
}
