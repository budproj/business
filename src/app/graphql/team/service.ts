import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { TeamDTO } from 'domain/team/dto'
import { Team } from 'domain/team/entities'
import DomainTeamService from 'domain/team/service'

@Injectable()
class GraphQLTeamService extends GraphQLEntityService<Team, TeamDTO> {
  constructor(public readonly teamDomain: DomainTeamService) {
    super(RESOURCE.TEAM, teamDomain)
  }
}

export default GraphQLTeamService
