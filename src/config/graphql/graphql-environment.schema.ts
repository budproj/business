import * as Joi from '@hapi/joi'

export const GraphQLEnvironmentSchema = Joi.object({
  GRAPHQL_DEBUG_ENABLED: Joi.boolean().default(false),
  GRAPHQL_PLAYGROUND_ENABLED: Joi.boolean().default(false),
  GRAPHQL_INSTROSPECTION_ENABLED: Joi.boolean().default(false),
  GRAPHQL_SCHEMA_FILE_PATH: Joi.string().default('./dist/src/interface/graphql/schema.gql'),
  GRAPHQL_GODMOD_ENABLED: Joi.boolean().default(false),
  GRAPHQL_GLOBAL_PREFIX_ENABLED: Joi.boolean().default(true),
  GRAPHQL_UPLOADS_MAX_BYTE_FILE_SIZE: Joi.number().default(5000000),
  GRAPHQL_UPLOADS_MAX_NUMBER_OF_FILES: Joi.number().default(5),
})
