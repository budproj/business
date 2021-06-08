import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ObjectiveAttributesInput } from '../inputs/objective-attributes.input'

@ArgsType()
export class ObjectiveUpdateRequest {
  @Field(() => ID)
  public readonly id: string

  @Field(() => ObjectiveAttributesInput)
  public readonly data: ObjectiveAttributesInput
}
