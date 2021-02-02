import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

import { POLICY } from 'src/app/authz/constants'
import { CONSTRAINT } from 'src/domain/constants'

registerEnumType(POLICY, {
  name: 'POLICY',
  description:
    'Defines if the current user has the permission for a given action regarding the resource',
})

registerEnumType(CONSTRAINT, {
  name: 'CONSTRAINT',
  description:
    'A constraint is a given scope inside our domain. It defines which type of resources are you trying to interact with',
})

@ObjectType('Policy', {
  description:
    'Defines the current available resource policies. You can use it to build read/create/update/delete logic on your application',
})
export class PolicyObject {
  @Field(() => POLICY, { defaultValue: POLICY.DENY })
  public create: POLICY

  @Field(() => POLICY, { defaultValue: POLICY.DENY })
  public read: POLICY

  @Field(() => POLICY, { defaultValue: POLICY.DENY })
  public update: POLICY

  @Field(() => POLICY, { defaultValue: POLICY.DENY })
  public delete: POLICY
}

@ObjectType('Permissions', {
  description: 'Defines all user permissions for each entity in our domain',
})
export class PermissionsObject {
  @Field(() => PolicyObject)
  public user: PolicyObject

  @Field(() => PolicyObject)
  public team: PolicyObject

  @Field(() => PolicyObject)
  public cycle: PolicyObject

  @Field(() => PolicyObject)
  public objective: PolicyObject

  @Field(() => PolicyObject)
  public keyResult: PolicyObject

  @Field(() => PolicyObject)
  public keyResultCheckIn: PolicyObject

  @Field(() => PolicyObject)
  public keyResultComment: PolicyObject

  @Field(() => PolicyObject)
  public keyResultCustomList: PolicyObject
}
