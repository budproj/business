import { Field, Int, ObjectType } from '@nestjs/graphql'

import { ConfidenceReport } from 'app/graphql/confidence-report/models'
import { KeyResult } from 'app/graphql/key-result/models'
import { ProgressReport } from 'app/graphql/progress-report/models'
import { Team } from 'app/graphql/team/models'

@ObjectType()
export class User {
  @Field(() => Int)
  id: number

  @Field()
  authzSub: string

  @Field({ nullable: true })
  role?: string

  @Field({ nullable: true })
  picture?: string

  @Field()
  createdAt: Date

  @Field()
  updatedAt: Date

  @Field(() => [KeyResult])
  keyResults: KeyResult[]

  @Field(() => [ProgressReport])
  progressReports: ProgressReport[]

  @Field(() => [ConfidenceReport])
  confidenceReports: ConfidenceReport[]

  @Field(() => [Team])
  teams: Promise<Team[]>
}
