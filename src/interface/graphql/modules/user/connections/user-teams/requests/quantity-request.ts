import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class QuantityNode {
  @Field(() => Number)
  public readonly keyResultsQuantity: number

  @Field(() => Number)
  public readonly objectivesQuantity: number

  @Field(() => Number)
  public readonly high: number

  @Field(() => Number)
  public readonly medium: number

  @Field(() => Number)
  public readonly low: number

  @Field(() => Number)
  public readonly barrier: number

  @Field(() => Number)
  public readonly achieved: number

  @Field(() => Number)
  public readonly deprioritized: number
}
