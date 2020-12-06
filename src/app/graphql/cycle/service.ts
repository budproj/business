import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { CycleDTO } from 'domain/cycle/dto'
import { Cycle } from 'domain/cycle/entities'
import DomainCycleService from 'domain/cycle/service'

@Injectable()
class GraphQLCycleService extends GraphQLEntityService<Cycle, CycleDTO> {
  constructor(public readonly cycleDomain: DomainCycleService) {
    super(RESOURCE.CYCLE, cycleDomain)
  }
}

export default GraphQLCycleService
