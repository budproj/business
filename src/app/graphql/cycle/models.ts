import { Field, ID, ObjectType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { ObjectiveObject } from 'app/graphql/objective/models'

@ObjectType()
export class CycleObject {
  @Field(() => ID)
  id: number

  @Field()
  dateStart: Date

  @Field()
  dateEnd: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => ID)
  companyId: CompanyObject['id']

  @Field(() => CompanyObject)
  company: CompanyObject

  @Field(() => [ObjectiveObject])
  objectives: ObjectiveObject[]
}
