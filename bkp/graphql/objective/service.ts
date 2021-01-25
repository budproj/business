import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { Objective } from 'src/domain/objective/entities'
import DomainObjectiveService from 'src/domain/objective/service'

@Injectable()
class GraphQLObjectiveService extends GraphQLEntityService<Objective, ObjectiveDTO> {
  constructor(public readonly objectiveDomain: DomainObjectiveService) {
    super(RESOURCE.OBJECTIVE, objectiveDomain)
  }
}

export default GraphQLObjectiveService
