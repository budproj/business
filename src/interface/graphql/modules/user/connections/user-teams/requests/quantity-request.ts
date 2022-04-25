import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class QuantityNode {
  @Field(() => Number)
  public readonly keyResultsQuantity: number

  @Field(() => Number)
  public readonly objectivesQuantity: number

  @Field(() => Number)
  public readonly highConfidence: number

  @Field(() => Number)
  public readonly mediumConfidence: number

  @Field(() => Number)
  public readonly lowConfidence: number

  @Field(() => Number)
  public readonly barrier: number
}
