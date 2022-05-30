import { Field, ID, InputType } from '@nestjs/graphql'

import { Cadence } from '@core/modules/cycle/enums/cadence.enum'

import { CadenceGraphQLEnum } from '../enums/cadence.enum'

@InputType('CycleInput', { description: 'Data required to create a new Cycle' })
export class CycleInput {
  @Field({ description: 'The title of the cycle' })
  public readonly period: string

  @Field(() => CadenceGraphQLEnum, { description: 'The cadence of the cycle' })
  public readonly cadence: Cadence

  @Field(() => Boolean, { description: 'The type of the cycle' })
  public readonly active: boolean

  @Field(() => Date, { description: 'The start date of the cycle' })
  public readonly dateStart: Date

  @Field(() => Date, { description: 'The end date of the cycle' })
  public readonly dateEnd: Date

  @Field(() => ID, { description: 'The team ID that this cycle belongs to' })
  public readonly teamId: string

  @Field({
    description: 'The parent cycle ID of this cycle',
    nullable: true,
  })
  public readonly parentId?: string
}
