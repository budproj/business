import { ArgsType, Field } from '@nestjs/graphql'

import {
  KeyResultAddUserToSupportTeamInput,
  KeyResultRemoveUserToSupportTeamInput,
} from '../inputs/key-result-support-team.input'

@ArgsType()
export class KeyResultSupportTeamCreateRequest {
  @Field(() => KeyResultAddUserToSupportTeamInput)
  public readonly data: KeyResultAddUserToSupportTeamInput
}

@ArgsType()
export class KeyResultSupportTeamRemoveRequest {
  @Field(() => KeyResultRemoveUserToSupportTeamInput)
  public readonly data: KeyResultRemoveUserToSupportTeamInput
}
