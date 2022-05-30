import { ArgsType, Field, ID } from '@nestjs/graphql'

import { CycleAttributesInput } from '../inputs/cycle-attributes.input'

@ArgsType()
export class CycleUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => CycleAttributesInput)
  public readonly data: CycleAttributesInput
}
