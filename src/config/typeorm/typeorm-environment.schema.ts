import * as Joi from '@hapi/joi'

export const TypeORMEnvironmentSchema = Joi.object({
  TYPEORM_HOST: Joi.string().required(),
  TYPEORM_USERNAME: Joi.string().required(),
  TYPEORM_PASSWORD: Joi.string().required(),
  TYPEORM_CONNECTION_TYPE: Joi.string().valid('postgres').default('postgres'),
  TYPEORM_PORT: Joi.number().default(5432),
  TYPEORM_DATABASE: Joi.string().default('business'),
  TYPEORM_ENTITIES: Joi.string().default('dist/src/**/*.orm-entity.js'),
  TYPEORM_MIGRATIONS: Joi.string().default('dist/src/infrastructure/orm/migrations/*.js'),
  TYPEORM_MIGRATIONS_DIR: Joi.string().default('src/infrastructure/orm/migrations'),
  TYPEORM_LOGGING_ENABLED: Joi.boolean().default(false),
  TYPEORM_CONVENTION_NAMING_ENABLED: Joi.boolean().default(true),
  TYPEORM_MAX_CONNECTION_POOL: Joi.number().default(10),
  TYPEORM_CONNECTION_POOL_TIMEOUT_S: Joi.number().default(60),
})
