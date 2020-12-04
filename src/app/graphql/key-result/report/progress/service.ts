import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import DomainProgressReportService from 'domain/key-result/report/progress/service'

@Injectable()
class GraphQLProgressReportService extends GraphQLEntityService<DomainProgressReportService> {
  constructor(public readonly progressReportDomain: DomainProgressReportService) {
    super(RESOURCE.PROGRESS_REPORT, progressReportDomain)
  }
}

export default GraphQLProgressReportService