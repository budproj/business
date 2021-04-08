import { Field, Float, Int, InterfaceType } from '@nestjs/graphql'

@InterfaceType('Status', {
  description:
    "The current status of an entity. By status we mean progress, confidence, and other reported values from it's children",
})
export abstract class StatusGraphQLInterface {
  @Field(() => Float, {
    description:
      'The computed percentage current progress of this entity. The entity progress calculation vary based on the entity',
  })
  public progress: number

  @Field(() => Int, {
    description:
      "The computed current confidence of this entity. The confidence is always the lowest among the entity's children",
  })
  public confidence: number
}