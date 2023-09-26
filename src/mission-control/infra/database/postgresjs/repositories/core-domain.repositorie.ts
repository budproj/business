import { Injectable } from '@nestjs/common'

import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
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
    WITH latest_checkin AS (
      SELECT
          kc.key_result_id,
          MAX(kc.created_at) AS max_created_at
      FROM
          key_result_check_in kc
      GROUP BY
          kc.key_result_id)
  
    SELECT
        kr.id AS keyresult_id
    FROM
        key_result kr
    INNER JOIN
        objective o ON kr.objective_id = o.id
    INNER JOIN
        cycle c ON o.cycle_id = c.id
    LEFT JOIN
        latest_checkin lc ON kr.id = lc.key_result_id
    WHERE
        kr.owner_id = ${ownerId}
        AND kr.team_id = ${teamId}
        AND o.mode = ${ObjectiveMode.PUBLISHED}
        AND kr.mode = ${KeyResultMode.PUBLISHED}
        AND c.active = true
        AND (
            (lc.max_created_at IS NOT NULL AND lc.max_created_at < NOW() - INTERVAL '7 days')
            OR (lc.max_created_at IS NULL AND kr.created_at < NOW() - INTERVAL '7 days')
        )
    ORDER BY
        lc.max_created_at DESC NULLS LAST
    LIMIT 1;
  `

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
    INNER JOIN objective o ON o.id = kr.objective_id
    INNER JOIN CYCLE c ON c.id = o.cycle_id
    LEFT JOIN (
        SELECT key_result_id, MAX(created_at) AS max_created_at
        FROM key_result_check_in
        GROUP BY key_result_id
    ) max_ci ON kr.id = max_ci.key_result_id
    WHERE kr.team_id = ${teamId}
      AND o.mode = ${ObjectiveMode.PUBLISHED}
      AND kr.mode = ${KeyResultMode.PUBLISHED}
      AND EXISTS (
        SELECT 1
        FROM key_result_check_in
        WHERE key_result_id = kr.id
          AND confidence ${barrier}
      )
      AND kr.team_id IN (
        SELECT id
        FROM team
        WHERE owner_id = ${userId}
      )
      AND c.active = TRUE
    ORDER BY max_ci.max_created_at DESC NULLS LAST
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
