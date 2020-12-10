import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainProgressReportService from 'domain/key-result/report/progress/service'

@Injectable()
class GraphQLProgressReportService extends GraphQLEntityService<ProgressReport, ProgressReportDTO> {
  constructor(public readonly progressReportDomain: DomainProgressReportService) {
    super(RESOURCE.PROGRESS_REPORT, progressReportDomain)
  }
}

export default GraphQLProgressReportService
