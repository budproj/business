import { Field, ID, ObjectType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { KeyResultObject } from 'app/graphql/key-result/models'
import { UserObject } from 'app/graphql/user/models'

@ObjectType('Team', { description: 'A collection of users for a given company' })
export class TeamObject {
  @Field(() => ID, { description: 'The ID of the team' })
  id: number

  @Field({ description: 'The name of the team' })
  name: string

  @Field({ description: 'The creation date of the team' })
  createdAt: Date

  @Field({ description: 'The last update date of the team' })
  updatedAt: Date

  @Field(() => [KeyResultObject], {
    description: 'The creation date ordered list of key results that belongs to that team',
  })
  keyResults: KeyResultObject[]

  @Field(() => ID, { description: 'The company ID that owns this team' })
  companyId: CompanyObject['id']

  @Field(() => CompanyObject, { description: 'The company that owns this team' })
  company: CompanyObject

  @Field(() => [UserObject], {
    description: 'A creation date ordered list of users that are members of this team',
  })
  users: Promise<UserObject[]>

  @Field(() => ID, { description: 'The user ID that owns this team' })
  ownerId: UserObject['id']

  @Field(() => CompanyObject, { description: 'The user that owns this team' })
  owner: UserObject
}
