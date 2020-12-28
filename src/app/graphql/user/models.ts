import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { ConfidenceReportObject } from 'app/graphql/key-result/report/confidence/models'
import { ProgressReportObject } from 'app/graphql/key-result/report/progress/models'
import { ObjectiveObject } from 'app/graphql/objective/models'
import { TeamObject } from 'app/graphql/team/models'
import { USER_POLICY } from 'app/graphql/user/constants'
import { USER_GENDER } from 'domain/user/constants'

registerEnumType(USER_GENDER, {
  name: 'USER_GENDER',
  description: 'Each gender represents a possible gender option for our users',
})

@ObjectType('User', {
  description:
    'User is an entity inside a given company. It is associated with many teams, progress reports, and others.',
})
export class UserObject {
  @Field(() => ID, { description: 'The ID of the user' })
  id: string

  @Field({ description: 'The name of the user' })
  name: string

  @Field({ description: 'The sub field in Auth0 (their ID)' })
  authzSub: string

  @Field({ nullable: true, description: 'The gender of the user' })
  gender?: USER_GENDER

  @Field({ nullable: true, description: 'The user role in the company' })
  role?: string

  @Field({ nullable: true, description: 'The picture of the user' })
  picture?: string

  @Field({ description: 'The creation date of the user' })
  createdAt: Date

  @Field({ description: 'The last update date of this user' })
  updatedAt: Date

  @Field(() => [KeyResultObject], {
    description: 'The creation date ordered list of key results that this user owns',
  })
  keyResults: KeyResultObject[]

  @Field(() => [ObjectiveObject], {
    description: 'The creation date ordered list of objectives that this user owns',
  })
  objectives: ObjectiveObject[]

  @Field(() => [ProgressReportObject], {
    description: 'The creation date ordered list of progress reports created by this user',
  })
  progressReports: ProgressReportObject[]

  @Field(() => [ConfidenceReportObject], {
    description: 'The creation date ordered list of confidence reports created by this user',
  })
  confidenceReports: ConfidenceReportObject[]

  @Field(() => [TeamObject], {
    description: 'The creation date ordered list of teams that this user is part of',
  })
  teams: Promise<TeamObject[]>

  @Field(() => [TeamObject], {
    description: 'The creation date ordered list of teams that this user owns',
  })
  ownedTeams: TeamObject[]

  @Field(() => [CompanyObject], {
    description: 'The creation date ordered list of companies that this user owns',
  })
  ownedCompanies: CompanyObject[]
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

registerEnumType(USER_POLICY, {
  name: 'USER_POLICY',
  description: 'Defines if the user has the allowance for a given action regarding the resource',
})
