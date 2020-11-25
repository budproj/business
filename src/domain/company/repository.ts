import { EntityRepository, Repository } from 'typeorm'

import { Company } from './entities'

@EntityRepository(Company)
class CompanyRepository extends Repository<Company> {}

export default CompanyRepository
