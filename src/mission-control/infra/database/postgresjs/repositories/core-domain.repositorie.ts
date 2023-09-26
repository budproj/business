import { Injectable } from '@nestjs/common'

import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import {
  CoreDomainRepository,
  findKeyResultByConfidenceInput,
  findOutdatedKeyResultInput,
} from 'src/mission-control/domain/tasks/repositories/core-domain-repository'

import { PostgresJsService } from '../postgresjs.service'

import {
  CoreDomainDataMapper,
  keyResultFromMCContextOutputTable,
  userFromMCContextOutputTable,
} from './data-mappers/core-domain.data-mapper'

@Injectable()
export class PostgresJsCoreDomainRepository implements CoreDomainRepository {
  constructor(private readonly postgres: PostgresJsService) {}

  async findOneKeyResultWithOutdatedCheckin({ ownerId, teamId }: findOutdatedKeyResultInput) {
    const [queryOutput] = await this.postgres.getSqlInstance()<keyResultFromMCContextOutputTable[]>`
    SELECT kr.id AS keyresult_id
    FROM key_result kr
    INNER JOIN objective o ON o.id = kr.objective_id
    INNER JOIN CYCLE c ON c.id = o.cycle_id
    LEFT JOIN
      (SELECT key_result_id,
              MAX(created_at) AS max_created_at
       FROM key_result_check_in
       GROUP BY key_result_id) max_ci ON kr.id = max_ci.key_result_id
    LEFT JOIN key_result_check_in ci ON kr.id = ci.key_result_id
    AND max_ci.max_created_at = ci.created_at
    WHERE kr.owner_id = ${ownerId}
      AND kr.team_id = ${teamId}
      AND kr.mode = 'PUBLISHED'
      AND c.active = TRUE
      AND ((ci.created_at IS NOT NULL
            AND ci.created_at < NOW() - INTERVAL '7 days')
           OR (ci.created_at IS NULL
               AND kr.created_at < NOW() - INTERVAL '7 days'))
    LIMIT 1;`

    return queryOutput ? CoreDomainDataMapper.keyResultsToDomain(queryOutput) : null
  }

  async findOneKeyResultByConfidence({
    userId,
    teamId,
    confidence,
  }: findKeyResultByConfidenceInput): Promise<any> {
    const sql = this.postgres.getSqlInstance()
    const barrier =
      confidence === ConfidenceTag.BARRIER ? sql`= -1` : sql`>= 0 AND confidence <= 32`

    const [queryOutput] = await sql<keyResultFromMCContextOutputTable[]>`
    SELECT kr.id AS keyresult_id
    FROM key_result kr
    INNER JOIN team t ON t.id = kr.team_id
    INNER JOIN objective o ON o.id = kr.objective_id
    INNER JOIN CYCLE c ON c.id = o.cycle_id
    LEFT JOIN
      (SELECT key_result_id,
              MAX(created_at) AS max_created_at
       FROM key_result_check_in
       GROUP BY key_result_id) max_ci ON kr.id = max_ci.key_result_id
    WHERE t.owner_id = ${userId}
      AND c.active = TRUE
      AND kr.mode = 'PUBLISHED'
      AND kr.team_id = ${teamId}
      AND kr.id IN (SELECT key_result_id
        FROM key_result_check_in
        WHERE confidence ${barrier})
    LIMIT 1;`

    return queryOutput ? CoreDomainDataMapper.keyResultsToDomain(queryOutput) : null
  }

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
