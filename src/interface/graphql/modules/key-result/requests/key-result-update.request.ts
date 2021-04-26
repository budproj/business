import { ArgsType, Field, ID } from '@nestjs/graphql'

import { KeyResultInputObject } from '../objects/key-result-input.object'

@ArgsType()
export class KeyResultUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => KeyResultInputObject)
  public readonly data: KeyResultInputObject
}
