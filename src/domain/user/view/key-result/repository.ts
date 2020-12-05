import { Logger } from '@nestjs/common'
import { EntityRepository, FindConditions } from 'typeorm'

import DomainEntityRepository from 'domain/repository'
import { Team } from 'domain/team/entities'

import { KeyResultView } from './entities'

@EntityRepository(KeyResultView)
class DomainKeyResultViewRepository extends DomainEntityRepository<KeyResultView> {
  private readonly logger = new Logger(DomainKeyResultViewRepository.name)

  async findRelatedTeams(
    selector: FindConditions<KeyResultView>,
  ): Promise<Array<Partial<Team>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${KeyResultView.name}.teams`, 'teams')
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

export default DomainKeyResultViewRepository
