import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultFormat } from '@core/modules/key-result/enums/key-result-format.enum'
import { KeyResultType } from '@core/modules/key-result/enums/key-result-type.enum'
import { GuardedNodeGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-node.interface'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { NodeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/node.interface'
import { KeyResultTypeGraphQLEnum } from '@interface/graphql/modules/key-result/enums/key-result-type.enum'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'

import { KeyResultKeyResultCheckInsGraphQLConnection } from './connections/key-result-key-result-check-ins/key-result-key-result-check-ins.connection'
import { KeyResultKeyResultCheckMarkGraphQLConnection } from './connections/key-result-key-result-check-mark/key-result-key-result-check-marks.connection'
import { KeyResultKeyResultCommentsGraphQLConnection } from './connections/key-result-key-result-comments/key-result-key-result-comments.connection'
import { KeyResultKeyResultSupportTeamGraphQLConnection } from './connections/key-result-key-result-support-team/key-result-key-result-support-team.connection'
import { KeyResultProgressHistoryGraphQLConnection } from './connections/key-result-progress-history/key-result-progress-history.connection'
import { KeyResultTimelineGraphQLConnection } from './connections/key-result-timeline/key-result-key-result-timeline.connection'
import { KeyResultFormatGraphQLEnum } from './enums/key-result-format.enum'

@ObjectType('KeyResult', {
  implements: () => [NodeRelayGraphQLInterface, GuardedNodeGraphQLInterface],
  description: 'A key-result is a given goal inside an objective',
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

  @Field(() => KeyResultTypeGraphQLEnum, {
    complexity: 0,
    description: 'The type of the key result',
  })
  public readonly type: KeyResultType

  @Field({ complexity: 0, description: 'The last update date of the key result' })
  public readonly updatedAt!: Date

  @Field(() => ID, { complexity: 0, description: 'The owner ID of the key result' })
  public readonly ownerId!: string

  @Field(() => ID, { complexity: 0, description: 'The object ID that this key result belongs to' })
  public readonly objectiveId!: string

  @Field(() => ID, {
    complexity: 0,
    nullable: true,
    description: 'The team ID that this key result belongs to',
  })
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

  @Field(() => StatusGraphQLObject, {
    complexity: 1,
    description:
      'The status of the given key-result. Here you can fetch the current progress, confidence, and others for that key-result',
  })
  public status: StatusGraphQLObject

  @Field(() => DeltaGraphQLObject, {
    complexity: 1,
    description: 'The delta of this key-result comparing with last week',
  })
  public delta!: DeltaGraphQLObject

  // **********************************************************************************************
  // CONNECTION FIELDS
  // **********************************************************************************************

  @Field(() => KeyResultKeyResultSupportTeamGraphQLConnection, {
    description: 'A created date ordered list of key result support team users',
    nullable: true,
  })
  public readonly supportTeamMembers?: KeyResultKeyResultSupportTeamGraphQLConnection

  @Field(() => KeyResultKeyResultCommentsGraphQLConnection, {
    description: 'A created date ordered list of key result comments for this key result',
    nullable: true,
  })
  public readonly keyResultComments?: KeyResultKeyResultCommentsGraphQLConnection

  @Field(() => KeyResultKeyResultCheckInsGraphQLConnection, {
    description: 'A created date ordered list of key result check-ins for this key result',
    nullable: true,
  })
  public readonly keyResultCheckIns?: KeyResultKeyResultCheckInsGraphQLConnection

  @Field(() => KeyResultTimelineGraphQLConnection, {
    description:
      'The timeline for this key result. It is ordered by creation date and is composed by both check-ins and comments',
  })
  public timeline?: KeyResultTimelineGraphQLConnection

  @Field(() => KeyResultKeyResultCheckMarkGraphQLConnection, {
    description: 'The check-marks for this key result',
  })
  public checkList: KeyResultKeyResultCheckMarkGraphQLConnection

  @Field(() => KeyResultProgressHistoryGraphQLConnection, {
    description: 'The progress history for this key result',
  })
  public progressHistory?: KeyResultProgressHistoryGraphQLConnection

  public readonly id!: string
  public readonly createdAt!: Date
  public readonly policy?: NodePolicyGraphQLObject
}
