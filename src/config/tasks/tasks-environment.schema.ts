import * as Joi from '@hapi/joi'

export const TasksEnvironmentSchema = Joi.object({
  TASKS_NATS_SERVERS: Joi.string().required(),
})
