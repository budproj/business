import * as Joi from '@hapi/joi'

import { LogLevel } from '@lib/logger/logger.enum'

export const ServerEnvironmentSchema = Joi.object({
  SERVER_PORT: Joi.number().default(3000),
  SERVER_HOST: Joi.string().default('localhost'),
  SERVER_NETWORK_ADDRESS: Joi.string().default('0.0.0.0'),
  SERVER_PREFIX: Joi.string(),
  SERVER_CORS_CREDENTIALS_FLAG: Joi.boolean().default(true),
  SERVER_CORS_ALLOWED_ORIGINS: Joi.string().default('*'),
  SERVER_LOGGING_LEVEL: Joi.string()
    .valid(...Object.keys(LogLevel))
    .default('ERROR'),
  SERVER_LOGGING_SERVICE_NAME: Joi.string().default('business@unknown'),
})
