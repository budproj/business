import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class UserDeactivateRequest {
  @Field(() => ID)
  public readonly id: string
}
