import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { ObjectiveDTO } from 'domain/objective/dto'
import { Objective } from 'domain/objective/entities'
import DomainObjectiveService from 'domain/objective/service'

@Injectable()
class GraphQLObjectiveService extends GraphQLEntityService<Objective, ObjectiveDTO> {
  constructor(public readonly objectiveDomain: DomainObjectiveService) {
    super(RESOURCE.OBJECTIVE, objectiveDomain)
  }
}

export default GraphQLObjectiveService
