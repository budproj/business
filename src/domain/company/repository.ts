import { EntityRepository, Repository } from 'typeorm'

import { Company } from './entities'

@EntityRepository(Company)
class DomainCompanyRepository extends Repository<Company> {}

export default DomainCompanyRepository
