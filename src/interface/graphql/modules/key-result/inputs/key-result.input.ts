import { Field, Float, ID, InputType } from '@nestjs/graphql'

import { KeyResultFormat } from '@core/modules/key-result/enums/key-result-format.enum'
import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'
import { KeyResultFormatGraphQLEnum } from '@interface/graphql/modules/key-result/enums/key-result-format.enum'
import { KeyResultTypeGraphQLEnum } from '@interface/graphql/modules/key-result/enums/key-result-type.enum'

@InputType('KeyResultInput', { description: 'Data required to create a new Key Result' })
export class KeyResultInput {
  @Field({ description: 'The title of the key result', nullable: true })
  public readonly title: string

  @Field(() => Float, { description: 'The initial value of the key result', nullable: true })
  public readonly initialValue: number

  @Field(() => Float, { description: 'The goal of the key result', nullable: true })
  public readonly goal: number

  @Field(() => KeyResultFormatGraphQLEnum, {
    complexity: 0,
    description: 'The format of the key result',
  })
  public readonly format: KeyResultFormat

  @Field(() => KeyResultTypeGraphQLEnum, {
    complexity: 0,
    description: 'The type of the key result',
    defaultValue: KeyResultType.ASCENDING,
  })
  public readonly type: KeyResultType

  @Field(() => ID, { description: 'The owner ID of the key result', nullable: true })
  public readonly ownerId: string

  @Field(() => ID, { description: 'The object ID that this key result belongs to', nullable: true })
  public readonly objectiveId: string

  @Field(() => ID, { description: 'The team ID that this key result belongs to', nullable: true })
  public readonly teamId: string

  @Field({
    description: 'The description explaining the key result',
    nullable: true,
  })
  public readonly description?: string
}
