import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('UserRoleObject', {
  description: 'An object continaing the role of the user in the auth0 system.',
})
export class UserRoleObject {
  @Field()
  public readonly id: string

  @Field()
  public readonly name: string

  @Field()
  public readonly description: string
}
