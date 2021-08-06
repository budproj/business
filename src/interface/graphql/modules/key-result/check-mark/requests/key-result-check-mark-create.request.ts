import { ArgsType, Field } from '@nestjs/graphql'

import { KeyResultCheckMarkInputObject } from '../objects/key-result-check-mark-input.objects'

@ArgsType()
export class KeyResultCheckMarkCreateRequest {
  @Field(() => KeyResultCheckMarkInputObject)
  public readonly data: KeyResultCheckMarkInputObject
}
