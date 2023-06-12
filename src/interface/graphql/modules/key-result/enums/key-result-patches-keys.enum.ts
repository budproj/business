import { registerEnumType } from '@nestjs/graphql/dist'

import { KeyResultPatchsKeys } from '@core/modules/key-result/enums/key-result-patch.enum'

export const KeyResultPatchesKeysGraphQLEnum = KeyResultPatchsKeys

registerEnumType(KeyResultPatchesKeysGraphQLEnum, {
  name: 'KeyResultPatchesKeys',
  description: 'Each Patch represents data from what was updated in the key result.',
})
