import { Injectable } from '@nestjs/common'

import { CoreDomainRepository } from 'src/mission-control/domain/tasks/repositories/core-domain-repository'

import { PostgresJsService } from '../postgresjs.service'

import {
  CoreDomainDataMapper,
  userFromMCContextOutputTable,
} from './data-mappers/core-domain.data-mapper'

@Injectable()
export class PostgresJsCoreDomainRepository implements CoreDomainRepository {
  constructor(private readonly postgres: PostgresJsService) {}
  async findAllUsersAndTeams() {
    const queryOutput = await this.postgres.getSqlInstance()<userFromMCContextOutputTable[]>`
      SELECT tuu.user_id AS user_id,
             JSONB_AGG(tuu.team_id) AS team_ids
      FROM "team_users_user" tuu
      INNER JOIN "user" u ON u.id = tuu.user_id AND u.status = 'ACTIVE'
      GROUP BY user_id;
    `
    return CoreDomainDataMapper.usersAndTeamsToDomain(queryOutput)
  }
}
