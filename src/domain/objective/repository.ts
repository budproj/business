import { Logger } from '@nestjs/common'
import { EntityRepository, FindConditions, Repository } from 'typeorm'

import { Company } from 'domain/company/entities'
import { Team } from 'domain/team/entities'

import { Objective } from './entities'

@EntityRepository(Objective)
class DomainObjectiveRepository extends Repository<Objective> {
  private readonly logger = new Logger(DomainObjectiveRepository.name)

  async findRelatedCompanies(
    selector: FindConditions<Objective>,
  ): Promise<Array<Partial<Company>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${Objective.name}.cycle`, 'cycle')
      .select('cycle.companyId AS "id"')
      .execute()

    const companies: Company[] = await query

    this.logger.debug({
      companies,
      selector,
      message: 'Found related companies for selector',
    })

    return companies
  }

  async findRelatedTeams(
    selector: FindConditions<Objective>,
  ): Promise<Array<Partial<Team>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${Objective.name}.owner`, 'user')
      .leftJoinAndSelect('user.teams', 'teams')
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

export default DomainObjectiveRepository
