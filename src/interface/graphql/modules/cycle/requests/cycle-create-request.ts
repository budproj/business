import { ArgsType, Field } from '@nestjs/graphql'

import { CycleInput } from '../inputs/cycle.input'

@ArgsType()
export class CycleCreateRequest {
  @Field(() => CycleInput)
  public readonly data: CycleInput
}
