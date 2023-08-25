import { Task } from '@prisma/client'

import { TaskScope } from '../../../types'

export abstract class TaskAssigner {
  abstract assign(scope: TaskScope): Promise<Task[]>
}
