import { Injectable } from '@nestjs/common'

import { RESOURCE } from 'app/authz/constants'
import GraphQLEntityService from 'app/graphql/service'
import { CompanyDTO } from 'domain/company/dto'
import { Company } from 'domain/company/entities'
import DomainCompanyService from 'domain/company/service'

@Injectable()
class GraphQLCompanyService extends GraphQLEntityService<Company, CompanyDTO> {
  constructor(public readonly companyDomain: DomainCompanyService) {
    super(RESOURCE.COMPANY, companyDomain)
  }
}

export default GraphQLCompanyService
