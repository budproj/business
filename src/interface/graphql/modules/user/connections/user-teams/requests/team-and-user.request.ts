import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class TeamAndUserRequest {
  @Field(() => ID)
  public readonly userID: string

  @Field(() => ID)
  public readonly teamID: string
}
