import { ArgsType, Field, ID } from '@nestjs/graphql'

import { TeamUpdateInputObject } from '../objects/team-update-input.object'

@ArgsType()
export class TeamUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => TeamUpdateInputObject)
  public readonly data: TeamUpdateInputObject
}
