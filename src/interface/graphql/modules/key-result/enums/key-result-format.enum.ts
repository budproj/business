import { registerEnumType } from '@nestjs/graphql/dist'

import { KeyResultFormat } from '@core/modules/key-result/enums/key-result-format.enum'

export const KeyResultFormatGraphQLEnum = KeyResultFormat

registerEnumType(KeyResultFormatGraphQLEnum, {
  name: 'KeyResultFormat',
  description: 'Each format represents how our user wants to see the metrics of the key result',
})
