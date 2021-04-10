import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'
import { TeamGraphQLNode } from '../team/team.node'

import { UserCompanyEdgeGraphQLObject } from './user-company.edge'

@ObjectType('UserCompanies', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description:
    'A list containing a given user companies based on the provided filters and arguments',
})
export class UserCompaniesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<TeamGraphQLNode> {
  @Field(() => [UserCompanyEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: UserCompanyEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
