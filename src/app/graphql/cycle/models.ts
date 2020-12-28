import { Field, ID, ObjectType } from '@nestjs/graphql'

import { CompanyObject } from 'app/graphql/company/models'
import { ObjectiveObject } from 'app/graphql/objective/models'

@ObjectType('Cycle', {
  description:
    "The period of time that can contain multiple objectives. It is used to organize a company' strategy",
})
export class CycleObject {
  @Field(() => ID, { description: 'The ID of the cycle' })
  id: string

  @Field({ description: 'The date that this cycle starts' })
  dateStart: Date

  @Field({ description: 'The date that this cycle ends' })
  dateEnd: Date

  @Field({ description: 'The creation date of this cycle' })
  createdAt: Date

  @Field({ description: 'The last update date of this cycle' })
  updatedAt: Date

  @Field(() => ID, { description: 'The company ID that this cycle belongs to' })
  companyId: CompanyObject['id']

  @Field(() => CompanyObject, { description: 'The company that this cycle belongs to' })
  company: CompanyObject

  @Field(() => [ObjectiveObject], { description: 'The objectives inside this cycle' })
  objectives: ObjectiveObject[]
}
