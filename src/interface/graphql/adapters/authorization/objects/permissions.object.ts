import { Field, ObjectType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from './policy.object'

@ObjectType('Permissions', {
  description: 'Defines all user permissions for each entity in our domain',
})
export class PermissionsGraphQLObject {
  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly user!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly team!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly cycle!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly objective!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly keyResult!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultCheckIn!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultComment!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public readonly keyResultCustomList!: PolicyGraphQLObject
}
