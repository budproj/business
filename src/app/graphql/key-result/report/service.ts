import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainKeyResultService from 'src/domain/key-result/service'

@Injectable()
class GraphQLKeyResultReportService extends GraphQLEntityService<KeyResult, KeyResultDTO> {
  constructor(public readonly keyResultDomain: DomainKeyResultService) {
    super(RESOURCE.PROGRESS_REPORT, keyResultDomain)
  }
}

export default GraphQLKeyResultReportService
