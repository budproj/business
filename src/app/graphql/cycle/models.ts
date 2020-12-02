import { Field, Int, ObjectType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { ObjectiveObject } from 'app/graphql/objective/models'

@ObjectType()
export class CycleObject {
  @Field(() => Int)
  id: number

  @Field()
  dateStart: Date

  @Field()
  dateEnd: Date

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => CompanyObject)
  company: CompanyObject

  @Field(() => [ObjectiveObject])
  objectives: ObjectiveObject[]
}
