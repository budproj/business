import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { ProgressReportDTO } from 'src/domain/key-result/report/progress/dto'
import { ProgressReport } from 'src/domain/key-result/report/progress/entities'
import DomainProgressReportService from 'src/domain/key-result/report/progress/service'

@Injectable()
class GraphQLProgressReportService extends GraphQLEntityService<ProgressReport, ProgressReportDTO> {
  constructor(public readonly progressReportDomain: DomainProgressReportService) {
    super(RESOURCE.PROGRESS_REPORT, progressReportDomain)
  }
}

export default GraphQLProgressReportService
