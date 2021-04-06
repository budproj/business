import * as Joi from '@hapi/joi'

export const GraphQLEnvironmentSchema = Joi.object({
  GRAPHQL_DEBUG_ENABLED: Joi.boolean().default(false),
  GRAPHQL_PLAYGROUND_ENABLED: Joi.boolean().default(false),
  GRAPHQL_INSTROSPECTION_ENABLED: Joi.boolean().default(false),
  GRAPHQL_SCHEMA_FILE_PATH: Joi.string().default('./dist/src/interface/graphql/schema.gql'),
})
