import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class UserDeactivateAndReactivateRequest {
  @Field(() => ID)
  public readonly id: string
}
