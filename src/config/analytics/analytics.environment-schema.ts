import * as Joi from '@hapi/joi'

export const AnalyticsEnvironmentSchema = Joi.object({
  ANALYTICS_URL: Joi.number().default('localhost:9090'),
  ANALYTICS_PACKAGES: Joi.string().default('analytics'),
})
