import { Field, ObjectType } from '@nestjs/graphql'

import { NodeGraphQLInterface } from '@interface/graphql/interfaces/node.interface'

import { PolicyGraphQLObject } from './policy.object'

@ObjectType('User', {
  implements: () => NodeGraphQLInterface,
  description:
    'User is an entity inside a given root team (a.k.a. company). It is associated with many teams, progress reports, and others.',
})
export class UserGraphQLObject implements NodeGraphQLInterface {
  @Field({ description: 'The name of the user' })
  public firstName: string

  @Field({ description: 'The sub field in Auth0 (their ID)' })
  public authzSub: string

  @Field({ description: 'The creation date of the user' })
  public createdAt: Date

  @Field({ description: 'The last update date of this user' })
  public updatedAt: Date

  @Field({ description: 'The full name of the user' })
  public fullName?: string

  @Field({ description: 'The last name of the user', nullable: true })
  public lastName?: string

  @Field({ description: 'The user role in the company', nullable: true })
  public role?: string

  @Field({ description: 'The picture of the user', nullable: true })
  public picture?: string

  @Field(() => String, {
    description: 'The custom nickname that user wants to be called',
    nullable: true,
  })
  public nickname?: string

  @Field(() => String, {
    description:
      'A description for that user. A more detailed information where the user tells about her/himself',
    nullable: true,
  })
  public about?: string

  @Field(() => String, {
    description: "The URL for the user's LinkedIn profile",
    nullable: true,
  })
  public linkedInProfileAddress?: string

  public id: string
  public policies?: PolicyGraphQLObject
}
