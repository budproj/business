import { Field, ObjectType } from '@nestjs/graphql'

import { Effect } from '@adapters/policy/enums/effect.enum'

import { EffectGraphQLEnum } from '../enums/effect.enum'

@ObjectType('ResourcePolicy', {
  description:
    'Defines the resource policies for a given resource. You can use it to build create/read/update/delete logic on your application',
})
export class ResourcePolicyGraphQLObject {
  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly create!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly read!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly update!: Effect

  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly delete!: Effect
}
