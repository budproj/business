import { Logger } from '@nestjs/common'
import { EntityRepository, FindConditions, Repository } from 'typeorm'

import { Team } from 'domain/team/entities'
import { User } from 'domain/user/entities'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class DomainCycleRepository extends Repository<Cycle> {
  private readonly logger = new Logger(DomainCycleRepository.name)

  async findRelatedTeams(selector: FindConditions<Cycle>): Promise<Array<Partial<Team>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${Cycle.name}.company`, 'company')
      .leftJoinAndSelect('company.teams', 'teams')
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

  async findRelatedOwners(selector: FindConditions<Cycle>): Promise<Array<Partial<User>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${Cycle.name}.company`, 'company')
      .select('company.ownerId as "id"')
      .execute()

    const owners: User[] = await query

    this.logger.debug({
      owners,
      selector,
      message: 'Found related owners for selector',
    })

    return owners
  }
}

export default DomainCycleRepository
