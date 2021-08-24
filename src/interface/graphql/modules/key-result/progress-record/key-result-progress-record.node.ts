import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'

import { KeyResultCheckInGraphQLNode } from '../check-in/key-result-check-in.node'
import { KeyResultGraphQLNode } from '../key-result.node'

@ObjectType('KeyResultProgressRecord', {
  implements: () => [NodeRelayGraphQLInterface],
  description: 'This object represents a progress record for a given key-result',
})
export class KeyResultProgressRecordGraphQLNode implements NodeRelayGraphQLInterface {
  @Field(() => Date, {
    complexity: 0,
    description: 'The update date of the progress record',
  })
  public updatedAt!: Date

  @Field(() => Float, {
    complexity: 0,
    description: 'The progress of this record',
  })
  public progress!: number

  @Field(() => ID, {
    complexity: 0,
    description: 'The ID of the key-result associated to this progress record',
  })
  public keyResultId!: string

  @Field(() => ID, {
    complexity: 0,
    description: 'The ID of the key-result check-in associated to this progress record',
  })
  public keyResultCheckInId!: string

  @Field(() => Date, {
    complexity: 0,
    description: 'The date of the progress record report',
  })
  public date!: Date

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => KeyResultCheckInGraphQLNode, {
    complexity: 1,
    description: 'The check-in of this record',
  })
  public readonly keyResultCheckIn!: KeyResultCheckInGraphQLNode

  @Field(() => KeyResultGraphQLNode, {
    complexity: 1,
    description: 'The key-result of this record',
  })
  public readonly keyResult!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
}
