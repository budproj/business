import { ArgsType, Field } from '@nestjs/graphql'

import { KeyResultInput } from '@interface/graphql/modules/key-result/inputs/key-result.input'

@ArgsType()
export class KeyResultCreateRequest {
  @Field(() => KeyResultInput)
  public readonly data: KeyResultInput
}
