import * as Joi from '@hapi/joi'

export const AWSEnvironmentSchema = Joi.object({
  AWS_REGION: Joi.string().default('sa-east-1'),
  AWS_CREDENTIALS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_CREDENTIALS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().default('business.s3.getbud.co'),
  AWS_SES_SOURCE_NAME: Joi.string().default('Bud'),
  AWS_SES_SOURCE_EMAIL: Joi.string().default('hey@getbud.co'),
  AWS_SES_DEBUG_ENABLED: Joi.boolean().default(false),
})
