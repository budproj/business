import { ArgsType, Field } from '@nestjs/graphql'

import { KeyResultCheckInInputObject } from '../objects/key-result-check-in-input.object'

@ArgsType()
export class KeyResultCheckInCreateRequest {
  @Field(() => KeyResultCheckInInputObject)
  public readonly data: KeyResultCheckInInputObject
}
