import { registerEnumType } from '@nestjs/graphql/dist'

import { Scope } from '@adapters/policy/enums/scope.enum'

export const ScopeGraphQLEnum = Scope

registerEnumType(ScopeGraphQLEnum, {
  name: 'Scope',
  description:
    'An authorization scope for your resource. It defines the level of permission that the resource needs',
})
