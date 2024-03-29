import * as Joi from '@hapi/joi'

export const AmplitudeEnvironmentSchema = Joi.object({
  AMPLITUDE_SECRET_KEY: Joi.string().required(),
  AMPLITUDE_USER_PROFILE_URL: Joi.string().required(),
})
