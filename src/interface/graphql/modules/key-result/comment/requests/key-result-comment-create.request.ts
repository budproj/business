import { ArgsType, Field } from '@nestjs/graphql'

import { KeyResultCommentInputRequest } from './key-result-comment-input.request'

@ArgsType()
export class KeyResultCommentCreateRequest {
  @Field(() => KeyResultCommentInputRequest)
  public readonly data: KeyResultCommentInputRequest
}
