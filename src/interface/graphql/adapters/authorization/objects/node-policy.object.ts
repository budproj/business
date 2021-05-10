import { Field, ObjectType } from '@nestjs/graphql'

import { Effect } from '@adapters/policy/enums/effect.enum'

import { EffectGraphQLEnum } from '../enums/effect.enum'

@ObjectType('NodePolicy', {
  description:
    'Defines the resource policies for a given node. You can use it to build read/update/delete logic on your application',
})
export class NodePolicyGraphQLObject {
  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly read!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly update!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly delete!: Effect
}
