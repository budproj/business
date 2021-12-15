import { ArgsType, Field } from '@nestjs/graphql'

import { TeamCreateInputObject } from '../objects/team-create-input.object'

@ArgsType()
export class TeamCreateRequest {
  @Field(() => TeamCreateInputObject)
  public readonly data: TeamCreateInputObject
}
