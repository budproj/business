import { Field, Float, ObjectType } from '@nestjs/graphql'

import { KeyResultFormat } from '@core/modules/key-result/enums/key-result-format.enum'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'
import { Author } from '@core/modules/key-result/interfaces/key-result-author.interface'

import { KeyResultFormatGraphQLEnum } from '../../enums/key-result-format.enum'
import { KeyResultModeGraphQLEnum } from '../../enums/key-result-mode.enum'
import { KeyResultTypeGraphQLEnum } from '../../enums/key-result-type.enum'

import { KeyResultUpdateAuthorGraphQLObject } from './key-result-author.object'

@ObjectType('KeyResultState', {
  description: 'A list containing key-result updates history based on the provided filters and arguments',
})
export class KeyResultStateGraphQLObject {
  @Field(() => KeyResultModeGraphQLEnum, {
    complexity: 0,
    description: 'The mode of a key-result represented in its state.',
  })
  public readonly mode!: KeyResultMode

  @Field(() => String, {
    complexity: 0,
    description:
      'This property stores the title of a key-result in an entity that represents a state of this key-result.',
  })
  public readonly title!: string

  @Field(() => Float, {
    complexity: 0,
    description:
      'This property stores the goal of a key-result in an entity that represents a state of this key-result.',
  })
  public readonly goal!: number

  @Field(() => KeyResultFormatGraphQLEnum, {
    complexity: 0,
    description:
      'This property stores the format of a key-result in an entity that represents a state of this key-result.',
  })
  public readonly format!: KeyResultFormat

  @Field(() => KeyResultTypeGraphQLEnum, {
    complexity: 0,
    description:
      'This property stores the type of a key-result in an entity that represents a state of this key-result.',
  })
  public readonly type!: KeyResultType

  @Field(() => String, {
    complexity: 0,
    description:
      'This property stores the ownerId of a key-result in an entity that represents a state of this key-result.',
  })
  public readonly ownerId!: string

  @Field(() => String, {
    complexity: 0,
    description:
      'This property stores the description of a key-result in an entity that represents a state of this key-result.',
  })
  public readonly description?: string

  @Field(() => KeyResultUpdateAuthorGraphQLObject, {
    complexity: 0,
    description:
      'This property stores the author of a key-result in an entity that represents a state of this key-result.',
  })
  public readonly author?: Author
}
