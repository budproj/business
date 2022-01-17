import { ArgsType, Field, ID } from '@nestjs/graphql'

import { KeyResultCheckMarkUpdateAssigneeInputObject } from '../objects/key-result-check-mark-input.objects'

@ArgsType()
export class KeyResultCheckMarkUpdateAssigneeRequest {
  @Field(() => ID)
  id: string

  @Field(() => KeyResultCheckMarkUpdateAssigneeInputObject)
  public readonly data: KeyResultCheckMarkUpdateAssigneeInputObject
}
