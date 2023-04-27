import { registerEnumType } from '@nestjs/graphql/dist'

import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'

export const KeyResultModeGraphQLEnum = KeyResultMode

registerEnumType(KeyResultModeGraphQLEnum, {
  name: 'KeyResultMode',
  description: 'Each mode represents the state the key result is in in its lifecycle.',
})
