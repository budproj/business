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
    SELECT
        USER_ID,
        JSONB_AGG(TEAM_ID) AS TEAM_IDS
    FROM
        TEAM_USERS_USER TUU
    GROUP BY
        USER_ID;
`
    return CoreDomainDataMapper.usersAndTeamsToDomain(queryOutput)
  }

  // { returned: Result(1) [ { first_name: 'Evil' } ] }

  // async findUserById(userId: string): Promise<string> {
  //   return this.postgres.getSqlInstance()<User[]>`
  //     SELECT
  //       "first_name"
  //     FROM "user"
  //     WHERE id = ${userId}
  //   `.then((result) => result[0].first_name)
  // }
}
