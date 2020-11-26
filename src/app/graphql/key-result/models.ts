import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql'

import { ConfidenceReport } from 'app/graphql/confidence-report/models'
import { Objective } from 'app/graphql/objective/models'
import { ProgressReport } from 'app/graphql/progress-report/models'
import { Team } from 'app/graphql/team/models'
import { User } from 'app/graphql/user/models'
import { KeyResultFormat } from 'domain/key-result/dto'

registerEnumType(KeyResultFormat, {
  name: 'KeyResultFormat',
  description: 'Each format represents how our user wants to see the metrics of the key result',
})

@ObjectType()
export class KeyResult {
  @Field(() => Int)
  id: number

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Int)
  initialValue: number

  @Field(() => Int)
  goal: number

  @Field()
  format: KeyResultFormat

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => User)
  owner: User

  @Field(() => Objective)
  objective: Objective

  @Field(() => Team)
  team: Team

  @Field(() => [ProgressReport])
  progressReports: ProgressReport[]

  @Field(() => [ConfidenceReport])
  confidenceReports: ConfidenceReport[]
}
