import { Injectable } from '@nestjs/common'

import { CompanyDTO } from 'domain/company/dto'
import DomainService from 'domain/service'

import { Company } from './entities'
import DomainCompanyRepository from './repository'

@Injectable()
class DomainCompanyService extends DomainService<Company, CompanyDTO> {
  constructor(public readonly repository: DomainCompanyRepository) {
    super(repository, DomainCompanyService.name)
  }
}

export default DomainCompanyService
