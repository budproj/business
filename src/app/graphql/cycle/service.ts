import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import DomainCycleService from 'domain/cycle/service'

@Injectable()
class GraphQLCycleService extends GraphQLEntityService<DomainCycleService> {
  constructor(public readonly cycleDomain: DomainCycleService) {
    super(RESOURCE.CYCLE, cycleDomain)
  }
}

export default GraphQLCycleService
