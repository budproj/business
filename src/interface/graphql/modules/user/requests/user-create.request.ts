import { ArgsType, Field } from '@nestjs/graphql'

import { UserCreateInputObject } from '../objects/user-create-input.object'

@ArgsType()
export class UserCreateRequest {
  @Field(() => UserCreateInputObject)
  public readonly data: UserCreateInputObject
}
