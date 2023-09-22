import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class UserSettingUpdateMainTeamRequest {
  @Field(() => ID, {
    description: 'The ID of the user you are updating settings',
  })
  public userID: string

  @Field(() => String, {
    description: 'The value of the new main team in the preferences column',
  })
  public main_team_id: string
}
