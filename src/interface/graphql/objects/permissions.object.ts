import { Field, ObjectType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from './policy.object'

@ObjectType('Permissions', {
  description: 'Defines all user permissions for each entity in our domain',
})
export class PermissionsGraphQLObject {
  @Field(() => PolicyGraphQLObject)
  public user: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject)
  public team: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject)
  public cycle: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject)
  public objective: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject)
  public keyResult: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject)
  public keyResultCheckIn: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject)
  public keyResultComment: PolicyGraphQLObject

  @Field(() => PolicyGraphQLObject)
  public keyResultCustomList: PolicyGraphQLObject
}
