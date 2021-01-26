import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { TeamObject } from 'src/app/graphql/team/models'

// import { KeyResultObject } from 'src/app/graphql/key-result/models'
// import { ConfidenceReportObject } from 'src/app/graphql/key-result/report/confidence/models'
// import { ProgressReportObject } from 'src/app/graphql/key-result/report/progress/models'
// import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { USER_POLICY } from 'src/app/graphql/user/constants'
import { USER_GENDER } from 'src/domain/user/constants'

registerEnumType(USER_GENDER, {
  name: 'USER_GENDER',
  description: 'Each gender represents a possible gender option for our users',
})

registerEnumType(USER_POLICY, {
  name: 'USER_POLICY',
  description: 'Defines if the user has the allowance for a given action regarding the resource',
})

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

  // @Field(() => [KeyResultObject], {
  //   description: 'The creation date ordered list of key results that this user owns',
  // })
  // keyResults: KeyResultObject[]
  //
  // @Field(() => [ObjectiveObject], {
  //   description: 'The creation date ordered list of objectives that this user owns',
  // })
  // objectives: ObjectiveObject[]
  //
  // @Field(() => [ProgressReportObject], {
  //   description: 'The creation date ordered list of progress reports created by this user',
  // })
  // progressReports: ProgressReportObject[]
  //
  // @Field(() => [ConfidenceReportObject], {
  //   description: 'The creation date ordered list of confidence reports created by this user',
  // })
  // confidenceReports: ConfidenceReportObject[]
  //
  //
}

@ObjectType('Policies', {
  description:
    'Defines the current user policies regarding a given resource. You can use it to display read/create/update/delete controls on your application',
})
export class PoliciesObject {
  @Field(() => USER_POLICY, { defaultValue: USER_POLICY.DENY })
  create: USER_POLICY

  @Field(() => USER_POLICY, { defaultValue: USER_POLICY.DENY })
  read: USER_POLICY

  @Field(() => USER_POLICY, { defaultValue: USER_POLICY.DENY })
  update: USER_POLICY

  @Field(() => USER_POLICY, { defaultValue: USER_POLICY.DENY })
  delete: USER_POLICY
}
