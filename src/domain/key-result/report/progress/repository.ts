import { Logger } from '@nestjs/common'
import { EntityRepository, FindConditions } from 'typeorm'

import DomainEntityRepository from 'domain/repository'
import { Team } from 'domain/team/entities'

import { ProgressReport } from './entities'

@EntityRepository(ProgressReport)
class DomainProgressReportRepository extends DomainEntityRepository<ProgressReport> {
  private readonly logger = new Logger(DomainProgressReportRepository.name)

  async findRelatedTeams(
    selector: FindConditions<ProgressReport>,
  ): Promise<Array<Partial<Team>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${ProgressReport.name}.keyResult`, 'keyResult')
      .leftJoinAndSelect('keyResult.team', 'team')
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

export default DomainProgressReportRepository
