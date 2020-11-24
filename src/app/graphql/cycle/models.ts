import { Field, Int, ObjectType } from '@nestjs/graphql'

import { Company } from 'app/graphql/company/models'
import { Objective } from 'app/graphql/objective/models'

@ObjectType()
export class Cycle {
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

  @Field(() => Company)
  company: Company

  @Field(() => [Objective])
  objectives: Objective[]
}
