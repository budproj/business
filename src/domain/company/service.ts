import { Injectable } from '@nestjs/common'

import DomainService from 'domain/service'

import { Company } from './entities'
import DomainCompanyRepository from './repository'

@Injectable()
class DomainCompanyService extends DomainService {
  constructor(private readonly repository: DomainCompanyRepository) {
    super()
  }

  async getOneById(id: Company['id']): Promise<Company> {
    return this.repository.findOne({ id })
  }
}

export default DomainCompanyService
