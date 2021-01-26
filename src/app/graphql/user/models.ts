import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultCustomListObject } from 'src/app/graphql/key-result/custom-list/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { TeamObject } from 'src/app/graphql/team/models'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { USER_GENDER } from 'src/domain/user/constants'

@ObjectType('User', {
  description:
    'User is an entity inside a given root team (a.k.a. company). It is associated with many teams, progress reports, and others.',
})
export class UserObject {
  @Field(() => ID, { description: 'The ID of the user' })
  id: string

  @Field({ description: 'The name of the user' })
  firstName: string

  @Field({ description: 'The full name of the user' })
  fullName: string

  @Field({ description: 'The sub field in Auth0 (their ID)' })
  authzSub: string

  @Field({ description: 'The creation date of the user' })
  createdAt: Date

  @Field({ description: 'The last update date of this user' })
  updatedAt: Date

  @Field({ description: 'The last name of the user', nullable: true })
  lastName?: string

  @Field({ description: 'The gender of the user', nullable: true })
  gender?: USER_GENDER

  @Field({ description: 'The user role in the company', nullable: true })
  role?: string

  @Field({ description: 'The picture of the user', nullable: true })
  picture?: string

  @Field(() => [TeamObject], {
    description: 'The creation date ordered list of companies that this user is a part of',
    nullable: true,
  })
  companies?: TeamObject[]

  @Field(() => [TeamObject], {
    description: 'The creation date ordered list of teams that this user is part of',
    nullable: true,
  })
  teams?: Promise<TeamObject[]>

  @Field(() => [TeamObject], {
    description: 'The creation date ordered list of teams that this user owns',
    nullable: true,
  })
  ownedTeams?: TeamObject[]

  @Field(() => [ObjectiveObject], {
    description: 'The creation date ordered list of objectives that this user owns',
  })
  objectives: ObjectiveObject[]

  @Field(() => [KeyResultObject], {
    description: 'The creation date ordered list of key results that this user owns',
    nullable: true,
  })
  keyResults?: KeyResultObject[]

  @Field(() => [KeyResultCustomListObject], {
    description: 'The creation date ordered list of key result custom lists that this user owns',
    nullable: true,
  })
  keyResultCustomLists?: KeyResultCustomListObject[]

  @Field(() => [KeyResultCheckInObject], {
    description: 'The creation date ordered list of key result check-ins created by this user',
    nullable: true,
  })
  checkIns?: KeyResultCheckIn[]
}

registerEnumType(USER_GENDER, {
  name: 'USER_GENDER',
  description: 'Each gender represents a possible gender option for our users',
})
