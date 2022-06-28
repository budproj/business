import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserRoleObject', {
  description: 'An object continaing the role of the user in the auth0 system.',
})
export class UserRoleObject {
  @Field({
    nullable: true,
  })
  public readonly id?: string

  @Field({
    nullable: true,
  })
  public readonly name?: string

  @Field({
    nullable: true,
  })
  public readonly description?: string
}
