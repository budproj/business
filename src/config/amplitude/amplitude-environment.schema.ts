import * as Joi from '@hapi/joi'

export const AmplitudeEnvironmentSchema = Joi.object({
  AMPLITUDE_API_KEY: Joi.string().required(),
})
