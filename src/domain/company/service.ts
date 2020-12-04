import { Injectable } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityService from 'domain/service'

import { Company } from './entities'
import DomainCompanyRepository from './repository'

@Injectable()
class DomainCompanyService extends DomainEntityService<Company, CompanyDTO> {
  constructor(public readonly repository: DomainCompanyRepository) {
    super(repository, DomainCompanyService.name)
  }
}

export default DomainCompanyService
