import { Field, ObjectType } from '@nestjs/graphql'

import { AuthorType } from '@core/modules/key-result/enums/key-result-author-type'

import { KeyResultAuthorTypeGraphQLEnum } from '../../enums/key-result-author-type.enum'

@ObjectType('KeyResultUpdateAuthor', {
  description: 'The author of some operation performed on a key result.',
})
export class KeyResultUpdateAuthorGraphQLObject {
  @Field(() => KeyResultAuthorTypeGraphQLEnum, {
    complexity: 0,
    description: 'The type of author of the operation, which may or may not be a standard user.',
  })
  public readonly type: AuthorType

  @Field(() => String, {
    complexity: 0,
    description: 'The structure that identifies the author.',
  })
  public readonly identifier: string
}
