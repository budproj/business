import { Field, ObjectType } from '@nestjs/graphql'

import { KeyResultPatchsKeys } from '@core/modules/key-result/enums/key-result-patch.enum'

import { KeyResultPatchesKeysGraphQLEnum } from '../../enums/key-result-patches-keys.enum'

@ObjectType('KeyResultPatche', {
  description: 'A list containing key-result updates patches based on the provided filters and arguments',
})
export class KeyResultPatchesGraphQLObject {
  @Field(() => KeyResultPatchesKeysGraphQLEnum, {
    complexity: 0,
    description: 'The key representing the type of data that was updated.',
  })
  public readonly key!: KeyResultPatchsKeys

  @Field(() => String, {
    complexity: 0,
    description: 'The value that was updated in the key-result.',
  })
  public readonly value!: string
}
