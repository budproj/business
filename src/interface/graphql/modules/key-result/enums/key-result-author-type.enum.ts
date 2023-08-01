import { registerEnumType } from '@nestjs/graphql/dist'

import { AuthorType } from '@core/modules/key-result/enums/key-result-author-type'

export const KeyResultAuthorTypeGraphQLEnum = AuthorType

registerEnumType(KeyResultAuthorTypeGraphQLEnum, {
  name: 'KeyResultAuthorType',
  description: 'Each author type represents an entity that might be involved in some key result update.',
})
