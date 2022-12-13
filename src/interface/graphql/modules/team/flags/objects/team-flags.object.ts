import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TeamFlags', {
  description: 'Data referring to Team flags of a team.',
})
export class TeamFlagsObject {
  @Field(() => Number, { description: 'The number Key Results with outdated check-ins on team.' })
  public readonly outdatedLength: number

  @Field(() => Number, { description: 'The number Key Results with barrier status on team.' })
  public readonly barrierLength: number

  @Field(() => Number, {
    description: 'The number Key Results with low-confidence status on team.',
  })
  public readonly lowLength: number

  @Field(() => Number, {
    description: 'The number of users of team that is not related to any key-results.',
  })
  public readonly noRelatedLength: number
}
