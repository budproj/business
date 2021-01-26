import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { TeamObject } from 'src/app/graphql/team/models'
import { UserObject } from 'src/app/graphql/user/models'
import { KEY_RESULT_FORMAT } from 'src/domain/key-result/constants'

import { KeyResultCheckInObject } from './check-in/models'

@ObjectType('KeyResult', {
  description: 'A goal that is created for the team focusing in a given team objective',
})
export class KeyResultObject {
  @Field(() => ID, { description: 'The ID of the key result' })
  public id: string

  @Field({ description: 'The title(name) of the key result' })
  public title: string

  @Field(() => Float, { description: 'The initial value of the key result' })
  public initialValue: number

  @Field(() => Float, { description: 'The goal of the key result' })
  public goal: number

  @Field({ description: 'The format of the key result' })
  public format: KEY_RESULT_FORMAT

  @Field({ description: 'The creation date of the key result' })
  public createdAt: Date

  @Field({ description: 'The last update date of the key result' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The owner ID of the key result' })
  public ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The owner of the key result' })
  public owner: UserObject

  @Field(() => ID, { description: 'The object ID that this key result belongs to' })
  public objectiveId: ObjectiveObject['id']

  @Field(() => ObjectiveObject, { description: 'The objective that this key result belongs to' })
  public objective: ObjectiveObject

  @Field(() => ID, { description: 'The team ID that this key result belongs to' })
  public teamId: TeamObject['id']

  @Field(() => TeamObject, { description: 'The team that this key result belongs to' })
  public team: TeamObject

  @Field(() => PolicyObject, {
    description:
      'Group of policies regarding given key result. Those policies decribe actions that your user can perform with that given resource',
  })
  public policies: PolicyObject

  @Field({ description: 'The description explaining the key result', nullable: true })
  public description?: string

  @Field(() => KeyResultCheckInObject, {
    description: 'A created date ordered list of key result check-ins for this key result',
    nullable: true,
  })
  public checkIns?: KeyResultCheckInObject[]
}

registerEnumType(KEY_RESULT_FORMAT, {
  name: 'KEY_RESULT_FORMAT',
  description: 'Each format represents how our user wants to see the metrics of the key result',
})
