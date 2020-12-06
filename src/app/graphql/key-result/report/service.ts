import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { KeyResultDTO } from 'domain/key-result/dto'
import { KeyResult } from 'domain/key-result/entities'
import DomainKeyResultService from 'domain/key-result/service'

@Injectable()
class GraphQLKeyResultReportService extends GraphQLEntityService<KeyResult, KeyResultDTO> {
  constructor(public readonly keyResultDomain: DomainKeyResultService) {
    super(RESOURCE.PROGRESS_REPORT, keyResultDomain)
  }
}

export default GraphQLKeyResultReportService
