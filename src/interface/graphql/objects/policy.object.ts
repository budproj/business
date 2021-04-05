import { Field, ObjectType } from '@nestjs/graphql'

import { EffectType } from '@infrastructure/authz/authz.interface'
import { EffectGraphQLEnum } from '@interface/graphql/enums/effect.enum'

@ObjectType('Policy', {
  description:
    'Defines the current available resource policies. You can use it to build read/create/update/delete logic on your application',
})
export class PolicyGraphQLObject {
  @Field(() => EffectGraphQLEnum, { defaultValue: 'DENY' })
  public create: EffectType

  @Field(() => EffectGraphQLEnum, { defaultValue: 'DENY' })
  public read: EffectType

  @Field(() => EffectGraphQLEnum, { defaultValue: 'DENY' })
  public update: EffectType

  @Field(() => EffectGraphQLEnum, { defaultValue: 'DENY' })
  public delete: EffectType
}
