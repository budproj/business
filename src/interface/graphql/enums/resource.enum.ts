import { registerEnumType } from '@nestjs/graphql/dist'

import { Resource } from '@adapters/authorization/enums/resource.enum'

export const ResourceGraphQLEnum = Resource

registerEnumType(ResourceGraphQLEnum, {
  name: 'Resource',
  description: 'A domain resource. It represents a type of object in our domain context',
})
