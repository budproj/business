import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultFormat } from '@core/modules/key-result/enums/key-result-format.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/authorization/interfaces/guarded-node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { KeyResultFormatGraphQLEnum } from '@interface/graphql/enums/key-result-format.enum'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { NodeRelayInterface } from '@interface/graphql/relay/interfaces/node.interface'

import { KeyResultCheckInGraphQLNode } from './check-in/key-result-check-in.node'
import { KeyResultCommentGraphQLNode } from './comment/key-result-comment.node'

@ObjectType('KeyResult', {
  implements: () => [NodeRelayInterface, GuardedNodeGraphQLInterface],
  description:
    'The current status of this key-result. By status we mean progress, confidence, and other reported values from it',
})
export class KeyResultGraphQLNode implements GuardedNodeGraphQLInterface {
  @Field({ complexity: 0, description: 'The title of the key result' })
  public readonly title!: string

  @Field(() => Float, { complexity: 0, description: 'The initial value of the key result' })
  public readonly initialValue!: number

  @Field(() => Float, { complexity: 0, description: 'The goal of the key result' })
  public readonly goal!: number

  @Field(() => KeyResultFormatGraphQLEnum, {
    complexity: 0,
    description: 'The format of the key result',
  })
  public readonly format!: KeyResultFormat

  @Field({ complexity: 0, description: 'The last update date of the key result' })
  public readonly updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The owner ID of the key result' })
  public readonly ownerId!: string

  @Field(() => ID, { complexity: 0, description: 'The object ID that this key result belongs to' })
  public readonly objectiveId!: string

  @Field(() => ID, { complexity: 0, description: 'The team ID that this key result belongs to' })
  public readonly teamId!: string

  @Field({
    complexity: 0,
    description: 'The description explaining the key result',
    nullable: true,
  })
  public readonly description?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => UserGraphQLNode, { complexity: 1, description: 'The owner of the key result' })
  public readonly owner!: UserGraphQLNode

  @Field(() => ObjectiveGraphQLNode, {
    complexity: 1,
    description: 'The objective that this key result belongs to',
  })
  public readonly objective!: ObjectiveGraphQLNode

  @Field(() => TeamGraphQLNode, {
    complexity: 1,
    description: 'The team that this key result belongs to',
  })
  public readonly team!: TeamGraphQLNode

  @Field({
    complexity: 1,
    description:
      'Saying a key result is "outdated" means that the owner needs to do a new check-in to report the current key result progress',
  })
  public readonly isOutdated?: boolean

  @Field(() => KeyResultCheckInGraphQLNode, {
    description: 'The latest key result check-in reported for that key result',
    nullable: true,
  })
  public latestKeyResultCheckIn?: KeyResultCheckInGraphQLNode

  // **********************************************************************************************
  // CONNECTION FIELDS
  // **********************************************************************************************

  @Field(() => [KeyResultCommentGraphQLNode], {
    description: 'A created date ordered list of key result comments for this key result',
    nullable: true,
  })
  public readonly keyResultComments?: KeyResultCommentGraphQLNode[]

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: PolicyGraphQLObject
}
