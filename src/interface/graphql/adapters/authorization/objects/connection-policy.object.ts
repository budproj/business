import { Field, ObjectType } from '@nestjs/graphql'

import { Effect } from '@adapters/policy/enums/effect.enum'

import { EffectGraphQLEnum } from '../enums/effect.enum'

@ObjectType('ConnectionPolicy', {
  description:
    'Defines the resource policy for a given connection. You can use it to build create access logic on your application',
})
export class ConnectionPolicyGraphQLObject {
  @Field(() => EffectGraphQLEnum, { defaultValue: Effect.DENY, complexity: 0 })
  public readonly create!: Effect
}
