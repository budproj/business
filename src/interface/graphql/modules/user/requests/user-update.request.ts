import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UserInputObject } from '../objects/user-input.object'

@ArgsType()
export class UserUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => UserInputObject)
  public readonly data: UserInputObject
}
