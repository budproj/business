import { Field, ObjectType } from '@nestjs/graphql'

import { NodePolicyGraphQLObject } from './node-policy.object'

@ObjectType('Permissions', {
  description: 'Defines all user permissions for each entity in our domain',
})
export class PermissionsGraphQLObject {
  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly user!: NodePolicyGraphQLObject

  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly team!: NodePolicyGraphQLObject

  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly cycle!: NodePolicyGraphQLObject

  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly objective!: NodePolicyGraphQLObject

  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResult!: NodePolicyGraphQLObject

  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultCheckIn!: NodePolicyGraphQLObject

  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultComment!: NodePolicyGraphQLObject

  @Field(() => NodePolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultCustomList!: NodePolicyGraphQLObject
}
