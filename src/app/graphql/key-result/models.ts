import { Field, Float, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { TeamObject } from 'src/app/graphql/team/models'
import { UserObject } from 'src/app/graphql/user/models'
import { KEY_RESULT_FORMAT } from 'src/domain/key-result/constants'

@ObjectType('KeyResult', {
  description: 'A goal that is created for the team focusing in a given team objective',
})
export class KeyResultObject {
  @Field(() => ID, { description: 'The ID of the key result' })
  id: string

  @Field({ description: 'The title(name) of the key result' })
  title: string

  @Field(() => Float, { description: 'The initial value of the key result' })
  initialValue: number

  @Field(() => Float, { description: 'The goal of the key result' })
  goal: number

  @Field({ description: 'The format of the key result' })
  format: KEY_RESULT_FORMAT

  @Field({ description: 'The creation date of the key result' })
  createdAt: Date

  @Field({ description: 'The last update date of the key result' })
  updatedAt: Date

  @Field(() => ID, { description: 'The owner ID of the key result' })
  ownerId: UserObject['id']

  @Field(() => UserObject, { description: 'The owner of the key result' })
  owner: UserObject

  @Field(() => ID, { description: 'The object ID that this key result belongs to' })
  objectiveId: ObjectiveObject['id']

  @Field(() => ObjectiveObject, { description: 'The objective that this key result belongs to' })
  objective: ObjectiveObject

  @Field(() => ID, { description: 'The team ID that this key result belongs to' })
  teamId: TeamObject['id']

  @Field(() => TeamObject, { description: 'The team that this key result belongs to' })
  team: TeamObject

  @Field(() => PolicyObject, {
    description:
      'Group of policies regarding given key result. Those policies decribe actions that your user can perform with that given resource',
  })
  policies: PolicyObject

  @Field({ nullable: true, description: 'The description explaining the key result' })
  description?: string
}

registerEnumType(KEY_RESULT_FORMAT, {
  name: 'KEY_RESULT_FORMAT',
  description: 'Each format represents how our user wants to see the metrics of the key result',
})
