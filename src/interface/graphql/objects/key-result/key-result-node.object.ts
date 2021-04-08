import { Field, Float, ID, ObjectType } from '@nestjs/graphql'

import { KeyResultFormat } from '@core/modules/key-result/enums/key-result-format.enum'
import { KeyResultFormatGraphQLEnum } from '@interface/graphql/enums/key-result-format.enum'
import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'
import { PolicyGraphQLObject } from '@interface/graphql/objects/authorization/policy.object'
import { ObjectiveNodeGraphQLObject } from '@interface/graphql/objects/objetive/objective-node.object'
import { TeamNodeGraphQLObject } from '@interface/graphql/objects/team/team-node.object'
import { UserNodeGraphQLObject } from '@interface/graphql/objects/user/user-node.object'

@ObjectType('KeyResult', {
  implements: () => NodeGraphQLInterface,
  description:
    'The current status of this key-result. By status we mean progress, confidence, and other reported values from it',
})
export class KeyResultNodeGraphQLObject implements NodeGraphQLInterface {
  @Field({ description: 'The title of the key result' })
  public title: string

  @Field(() => Float, { description: 'The initial value of the key result' })
  public initialValue: number

  @Field(() => Float, { description: 'The goal of the key result' })
  public goal: number

  @Field(() => KeyResultFormatGraphQLEnum, { description: 'The format of the key result' })
  public format: KeyResultFormat

  @Field({
    description:
      'Saying a key result is "outdated" means that the owner needs to do a new check-in to report the current key result progress',
  })
  public isOutdated: boolean

  @Field({ description: 'The last update date of the key result' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The owner ID of the key result' })
  public ownerId: UserNodeGraphQLObject['id']

  @Field(() => UserNodeGraphQLObject, { description: 'The owner of the key result' })
  public owner: UserNodeGraphQLObject

  @Field(() => ID, { description: 'The object ID that this key result belongs to' })
  public objectiveId: ObjectiveNodeGraphQLObject['id']

  @Field(() => ObjectiveNodeGraphQLObject, {
    description: 'The objective that this key result belongs to',
  })
  public objective: ObjectiveNodeGraphQLObject

  @Field(() => ID, { description: 'The team ID that this key result belongs to' })
  public teamId: TeamNodeGraphQLObject['id']

  @Field(() => TeamNodeGraphQLObject, { description: 'The team that this key result belongs to' })
  public team: TeamNodeGraphQLObject

  @Field({ description: 'The description explaining the key result', nullable: true })
  public description?: string

  public id: string
  public createdAt: Date
  public policies?: PolicyGraphQLObject
}
