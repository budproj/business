import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { ConfidenceReportObject } from 'app/graphql/key-result/report/confidence/models'
import { ProgressReportObject } from 'app/graphql/key-result/report/progress/models'
import { ObjectiveObject } from 'app/graphql/objective/models'
import { TeamObject } from 'app/graphql/team/models'
import { UserPolicy } from 'app/graphql/user/types'

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
  @Field(() => UserPolicy, { defaultValue: UserPolicy.DENY })
  create: UserPolicy

  @Field(() => UserPolicy, { defaultValue: UserPolicy.DENY })
  read: UserPolicy

  @Field(() => UserPolicy, { defaultValue: UserPolicy.DENY })
  update: UserPolicy

  @Field(() => UserPolicy, { defaultValue: UserPolicy.DENY })
  delete: UserPolicy
}

registerEnumType(UserPolicy, {
  name: 'UserPolicy',
  description: 'Defines if the user has the allowance for a given action regarding the resource',
})
