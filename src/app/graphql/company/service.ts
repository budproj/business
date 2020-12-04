import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import DomainCompanyService from 'domain/company/service'

@Injectable()
class GraphQLCompanyService extends GraphQLEntityService<DomainCompanyService> {
  constructor(public readonly companyDomain: DomainCompanyService) {
    super(RESOURCE.COMPANY, companyDomain)
  }
}

export default GraphQLCompanyService
