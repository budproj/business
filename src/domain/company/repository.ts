import { Logger } from '@nestjs/common'
import { EntityRepository, FindConditions } from 'typeorm'

import DomainEntityRepository from 'domain/repository'
import { Team } from 'domain/team/entities'

import { Company } from './entities'

@EntityRepository(Company)
class DomainCompanyRepository extends DomainEntityRepository<Company> {
  private readonly logger = new Logger(DomainCompanyRepository.name)

  async findRelatedTeams(selector: FindConditions<Company>): Promise<Array<Partial<Team>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${Company.name}.teams`, 'teams')
      .select('teams.id as "id"')
      .execute()

    const teams: Team[] = await query

    this.logger.debug({
      teams,
      selector,
      message: 'Found related teams for selector',
    })

    return teams
  }
}

export default DomainCompanyRepository
