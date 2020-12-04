import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import DomainObjectiveService from 'domain/objective/service'

@Injectable()
class GraphQLObjectiveService extends GraphQLEntityService<DomainObjectiveService> {
  constructor(public readonly objectiveDomain: DomainObjectiveService) {
    super(RESOURCE.OBJECTIVE, objectiveDomain)
  }
}

export default GraphQLObjectiveService
