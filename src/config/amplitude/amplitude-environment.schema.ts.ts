import * as Joi from '@hapi/joi'

export const AmplitudeEnvironmentSchema = Joi.object({
  AMPLITUDE_DEV_SECRET_KEY: Joi.string().required(),
  AMPLITUDE_PROD_SECRET_KEY: Joi.string().required(),
  AMPLITUDE_USER_PROFILE_URL: Joi.string().required(),
  NODE_ENV: Joi.string().required(),
})
