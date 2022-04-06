import * as Joi from '@hapi/joi'

export const SentryEnvironmentSchema = Joi.object({
  SENTRY_DSN: Joi.string().required(),
  SENTRY_SAMPLE_RATE: Joi.number().default(1),
})
