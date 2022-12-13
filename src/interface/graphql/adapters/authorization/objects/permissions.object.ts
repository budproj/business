import { Field, ObjectType } from '@nestjs/graphql'

import { ResourcePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/resource-policy.object'

@ObjectType('Permissions', {
  description: 'Defines all user permissions for each entity in our domain',
})
export class PermissionsGraphQLObject {
  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly user!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly team!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly cycle!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly objective!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResult!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultCheckIn!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultComment!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultCustomList!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly workspace!: ResourcePolicyGraphQLObject

  @Field(() => ResourcePolicyGraphQLObject, { complexity: 0 })
  public readonly flags!: ResourcePolicyGraphQLObject
}
