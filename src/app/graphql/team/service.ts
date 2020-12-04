import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import DomainTeamService from 'domain/team/service'

@Injectable()
class GraphQLTeamService extends GraphQLEntityService<DomainTeamService> {
  constructor(public readonly teamDomain: DomainTeamService) {
    super(RESOURCE.TEAM, teamDomain)
  }
}

export default GraphQLTeamService
