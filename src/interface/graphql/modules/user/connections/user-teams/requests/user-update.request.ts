import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class AddTeamtoUserRequest {
  @Field(() => ID)
  public readonly userID: string

  @Field(() => ID)
  public readonly teamID: string
}
