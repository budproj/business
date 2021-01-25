import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { CycleDTO } from 'src/domain/cycle/dto'
import { Cycle } from 'src/domain/cycle/entities'
import DomainCycleService from 'src/domain/cycle/service'

@Injectable()
class GraphQLCycleService extends GraphQLEntityService<Cycle, CycleDTO> {
  constructor(public readonly cycleDomain: DomainCycleService) {
    super(RESOURCE.CYCLE, cycleDomain)
  }
}

export default GraphQLCycleService
