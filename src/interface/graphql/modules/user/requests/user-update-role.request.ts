import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class UserUpdateRoleRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => String)
  public readonly role: string
}
