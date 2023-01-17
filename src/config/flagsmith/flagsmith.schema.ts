import * as Joi from '@hapi/joi'

export const FlagsmithEnvironmentSchema = Joi.object({
  FLAGSMITH_SERVER_ENVIRONMENT_KEY: Joi.string().required(),
})
