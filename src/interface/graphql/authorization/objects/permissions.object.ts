import { Field, ObjectType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from './policy.object'

@ObjectType('Permissions', {
  description: 'Defines all user permissions for each entity in our domain',
})
export class PermissionsGraphQLObject {
  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public user!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public team!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public cycle!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public objective!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public keyResult!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public keyResultCheckIn!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public keyResultComment!: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject, { complexity: 0 })
  public keyResultCustomList!: PolicyGraphQLObject
}
