import * as Joi from '@hapi/joi'

export const AWSEnvironmentSchema = Joi.object({
  AWS_REGION: Joi.string().default('sa-east-1'),
  AWS_CREDENTIALS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_CREDENTIALS_SECRET_ACCESS_KEY: Joi.string().required(),
})
