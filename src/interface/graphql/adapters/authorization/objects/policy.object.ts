import { Field, ObjectType } from '@nestjs/graphql'

import { Effect } from '@adapters/policy/enums/effect.enum'

import { EffectGraphQLEnum } from '../enums/effect.enum'

@ObjectType('Policy', {
  description:
    'Defines the current available resource policies. You can use it to build read/create/update/delete logic on your application',
})
export class PolicyGraphQLObject {
  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly create!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly read!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly update!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly delete!: Effect
}
