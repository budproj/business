import { ArgsType, Field } from '@nestjs/graphql'

import { ObjectiveInput } from '@interface/graphql/modules/objective/inputs/objective.input'

@ArgsType()
export class ObjectiveCreateRequest {
  @Field(() => ObjectiveInput)
  public readonly data: ObjectiveInput
}
