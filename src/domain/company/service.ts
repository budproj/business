import { Injectable } from '@nestjs/common'

import { Company } from './entities'
import DomainCompanyRepository from './repository'

@Injectable()
class DomainCompanyService {
  constructor(private readonly repository: DomainCompanyRepository) {}

  async getOneById(id: Company['id']): Promise<Company> {
    return this.repository.findOne({ id })
  }
}

export default DomainCompanyService
