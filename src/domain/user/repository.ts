import { Logger } from '@nestjs/common'
import { EntityRepository, FindConditions, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import DomainEntityRepository from 'domain/repository'
import { Team } from 'domain/team/entities'

import { User } from './entities'

@EntityRepository(User)
class DomainUserRepository extends DomainEntityRepository<User> {
  private readonly logger = new Logger(DomainUserRepository.name)

  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<User>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${User.name}.teams`, 'teams')
        .andWhere('teams.companyId IN (:...allowedCompanies)', { allowedCompanies })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  async findRelatedTeams(selector: FindConditions<User>): Promise<Array<Partial<Team>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${User.name}.teams`, 'teams')
      .select('teams.companyId AS "companyId", teams.id as "id"')
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

export default DomainUserRepository
