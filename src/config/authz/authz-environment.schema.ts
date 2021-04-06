import * as Joi from '@hapi/joi'

export const AuthzEnvironmentSchema = Joi.object({
  AUTHZ_ISSUER: Joi.string().uri().required(),
  AUTHZ_AUDIENCE: Joi.string().uri().required(),
})
