import { Task } from 'src/mission-control/prisma/generated/mission-control'

import { TaskScope } from '../../../types'

export abstract class TaskAssigner {
  abstract assign(scope: TaskScope): Promise<Task[]>
}
