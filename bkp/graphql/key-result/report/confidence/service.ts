import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'src/app/authz/constants'
import GraphQLEntityService from 'src/app/graphql/service'
import { ConfidenceReportDTO } from 'src/domain/key-result/report/confidence/dto'
import { ConfidenceReport } from 'src/domain/key-result/report/confidence/entities'
import DomainConfidenceReportService from 'src/domain/key-result/report/confidence/service'

@Injectable()
class GraphQLConfidenceReportService extends GraphQLEntityService<
  ConfidenceReport,
  ConfidenceReportDTO
> {
  constructor(public readonly confidenceReportDomain: DomainConfidenceReportService) {
    super(RESOURCE.CONFIDENCE_REPORT, confidenceReportDomain)
  }
}

export default GraphQLConfidenceReportService
