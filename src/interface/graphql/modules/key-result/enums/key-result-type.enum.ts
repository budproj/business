import { registerEnumType } from '@nestjs/graphql/dist'

import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'

export const KeyResultTypeGraphQLEnum = KeyResultType

registerEnumType(KeyResultTypeGraphQLEnum, {
  name: 'KeyResultType',
  description: 'It represents the type of check-ins attached for this key result',
})
