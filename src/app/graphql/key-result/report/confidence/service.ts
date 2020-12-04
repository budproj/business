import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import DomainConfidenceReportService from 'domain/key-result/report/confidence/service'

@Injectable()
class GraphQLConfidenceReportService extends GraphQLEntityService<DomainConfidenceReportService> {
  constructor(public readonly confidenceReportDomain: DomainConfidenceReportService) {
    super(RESOURCE.CONFIDENCE_REPORT, confidenceReportDomain)
  }
}

export default GraphQLConfidenceReportService
