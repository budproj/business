import { Injectable } from '@nestjs/common'

import { Company } from './entities'
import CompanyRepository from './repository'

@Injectable()
class CompanyService {
  constructor(private readonly repository: CompanyRepository) {}

  async getOneById(id: Company['id']): Promise<Company> {
    return this.repository.findOne({ id })
  }
}

export default CompanyService
