import * as Joi from '@hapi/joi'

export const AuthzEnvironmentSchema = Joi.object({
  AUTHZ_DOMAIN: Joi.string().required(),
  AUTHZ_ISSUER: Joi.string().uri().required(),
  AUTHZ_AUDIENCE: Joi.string().uri().required(),
  AUTHZ_CLIENT_ID: Joi.string().required(),
  AUTHZ_CLIENT_SECRET: Joi.string().required(),
  AUTHZ_CONNECTION: Joi.string().default('Username-Password-Authentication'),
})
