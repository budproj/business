import { InputType, Field } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { UserGender } from '@core/modules/user/enums/user-gender.enum'
import { TeamGenderGraphQLEnum } from '@interface/graphql/modules/team/enums/team-gender.enum'
import { UserGenderGraphQLEnum } from '@interface/graphql/modules/user/enums/user-gender.enum'

@InputType('WorkspaceTeamCreateInput', {
  description: 'Data that you need to provide while creating a new team',
})
class WorkspaceTeamCreateInputObject {
  @Field(() => String, { description: 'The name of the team' })
  public readonly name: string

  @Field(() => String, { description: 'The description of the team', nullable: true })
  public readonly description?: string

  @Field(() => TeamGenderGraphQLEnum, {
    description: 'The description of the team',
    nullable: true,
  })
  gender?: TeamGender
}

@InputType('WorkspaceRootUserCreateInput', {
  description: 'Data that you need to provide while creating a new root user for a new workspace',
})
class WorkspaceRootUserCreateInputObject {
  @Field(() => String, { description: 'The first name of the user' })
  public readonly firstName: string

  @Field(() => String, { description: 'The last name of the user' })
  public readonly lastName: string

  @Field(() => String, { description: 'The role of the user in her/his company', nullable: true })
  public readonly role?: string

  @Field(() => UserGenderGraphQLEnum, {
    description: 'The gender of the user',
  })
  public readonly gender: UserGender

  @Field(() => String, {
    description: 'The e-mail for the user',
  })
  public readonly email: string

  @Field(() => String, {
    nullable: true,
    description: 'The locale for this user',
  })
  public readonly locale?: string
}

@InputType('WorkspaceCycleCreateInput', {
  description: 'Data that you need to provide while creating a new cycle',
})
class WorkspaceCycleCreateInputObject {
  @Field(() => String, { description: 'The period of that cycle' })
  public readonly period!: string

  @Field({ description: 'The date that this cycle starts' })
  public readonly dateStart!: Date

  @Field({ description: 'The date that this cycle ends' })
  public readonly dateEnd!: Date
}

@InputType('WorkspaceCreateInput', {
  description: 'Data that you need to provide while creating a new workspace',
})
export class WorkspaceCreateInputObject {
  @Field(() => WorkspaceTeamCreateInputObject, {
    description: 'The root team data of the workspace',
  })
  public readonly team!: WorkspaceTeamCreateInputObject

  @Field(() => WorkspaceRootUserCreateInputObject, {
    description: 'The root user of the workspace',
  })
  public readonly user!: WorkspaceRootUserCreateInputObject

  @Field(() => WorkspaceCycleCreateInputObject, {
    description: 'The initial yearly cycle of the workspace',
  })
  public readonly yearlyCycle!: WorkspaceCycleCreateInputObject

  @Field(() => WorkspaceCycleCreateInputObject, {
    description: 'The initial quarterly cycle of the workspace',
  })
  public readonly quarterlyCycle!: WorkspaceCycleCreateInputObject
}
