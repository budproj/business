import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserUpdateInputObject } from '../objects/user-update-input.object'

@ArgsType()
export class UserUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => UserUpdateInputObject)
  public readonly data: UserUpdateInputObject
}
