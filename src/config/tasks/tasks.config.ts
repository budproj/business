import { registerAs } from '@nestjs/config'

import { TasksConfigInterface } from '@config/tasks/tasks.interface'

export const tasksConfig = registerAs(
  'tasks',
  (): TasksConfigInterface => ({
    nats: {
      servers: process.env.TASKS_NATS_SERVERS.split(','),
    },
  }),
)
