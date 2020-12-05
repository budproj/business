import { Logger } from '@nestjs/common'
import { EntityRepository, FindConditions, Repository } from 'typeorm'

import { Team } from 'domain/team/entities'

import { User } from './entities'

@EntityRepository(User)
class DomainUserRepository extends Repository<User> {
  private readonly logger = new Logger(DomainUserRepository.name)

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
