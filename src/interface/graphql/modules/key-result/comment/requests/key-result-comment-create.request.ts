import { ArgsType, Field } from '@nestjs/graphql'

import { KeyResultCommentInputObject } from '../objects/key-result-comment-input.object'

@ArgsType()
export class KeyResultCommentCreateRequest {
  @Field(() => KeyResultCommentInputObject)
  public readonly data: KeyResultCommentInputObject
}
