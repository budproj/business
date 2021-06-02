import { ArgsType, Field, ID } from '@nestjs/graphql'

import { KeyResultAttributesInput } from '../inputs/key-result-attributes.input'

@ArgsType()
export class KeyResultUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => KeyResultAttributesInput)
  public readonly data: KeyResultAttributesInput
}
