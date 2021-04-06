import { registerEnumType } from '@nestjs/graphql/dist'

import { Effect } from '@adapters/authorization/enums/effect.enum'

export const EffectGraphQLEnum = Effect

registerEnumType(EffectGraphQLEnum, {
  name: 'Effect',
  description:
    'Defines if the current user has the permission for a given action regarding the resource',
})
