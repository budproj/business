import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserInputRequest } from './user-input.request'

@ArgsType()
export class UserUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => UserInputRequest)
  public readonly data: UserInputRequest
}
