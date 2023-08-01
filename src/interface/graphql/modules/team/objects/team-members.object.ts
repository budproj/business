import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('TeamMembers', {
  description:
    "The current status of an entity. By status we mean progress, confidence, and other reported values from it's children",
})
export class TeamMembersGraphQLObject {
  @Field(() => String, {
    complexity: 0,
    description: 'Team ID',
  })
  public readonly teamId!: string

  @Field(() => [String], {
    complexity: 0,
    description: 'User IDs',
  })
  public readonly userIds!: string[]
}
