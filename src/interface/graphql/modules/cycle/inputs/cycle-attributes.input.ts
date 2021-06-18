import { Field, ID, InputType } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CadenceGraphQLEnum } from '@interface/graphql/modules/cycle/enums/cadence.enum'

@InputType('CycleAttributesInput', {
  description: 'Data that you can assign to a given cycle',
})
export class CycleAttributesInput {
  @Field({ description: 'The period of the cycle', nullable: true })
  public readonly period?: string

  @Field(() => CadenceGraphQLEnum, {
    description:
      'The candence of this cycle. Cadence is the frequency at which previous objectives have to be grade and new ones created.',
    nullable: true,
  })
  public readonly cadence?: Cadence

  @Field({
    description: 'This flag defines if objectives related to this cycle can be updated',
    nullable: true,
  })
  public readonly active?: boolean

  @Field({ description: 'The date that this cycle starts', nullable: true })
  public readonly dateStart?: Date

  @Field({ description: 'The date that this cycle ends', nullable: true })
  public readonly dateEnd?: Date

  @Field({ description: 'The last update date of this cycle', nullable: true })
  public readonly updatedAt?: Date

  @Field(() => ID, { description: 'The team ID that this cycle belongs to', nullable: true })
  public readonly teamId?: string

  @Field(() => ID, {
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, the ID of that will be recorded here',
    nullable: true,
  })
  public readonly parentId?: string
}
