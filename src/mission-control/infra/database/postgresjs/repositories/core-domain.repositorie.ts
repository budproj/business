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
    const sql = this.postgres.getSqlInstance()

    const [queryOutput] = await sql<keyResultFromMCContextOutputTable[]>`
      WITH latest_checkin AS (
          SELECT krci.created_at, kr.id, kr.created_at AS key_result_created_at
          FROM key_result kr
          INNER JOIN objective o ON o.id = kr.objective_id
          INNER JOIN cycle c ON c.id = o.cycle_id
          LEFT JOIN key_result_check_in krci ON kr.id = krci.key_result_id
          WHERE kr.team_id = ${teamId}
                AND kr.mode = ${KeyResultMode.PUBLISHED}
                AND kr.owner_id = ${ownerId}
                AND c.active = true
                AND o.mode = ${ObjectiveMode.PUBLISHED}
                ORDER BY krci.key_result_id, krci.created_at DESC 
                LIMIT 1)
        SELECT ck.id
        FROM latest_checkin ck
        WHERE ck.created_at < NOW() - INTERVAL '7 days'
        OR (ck.created_at IS NULL AND ck.key_result_created_at < NOW() - INTERVAL '7 days');`

    return queryOutput
  }

  async findOneKeyResultByConfidence({
    userId,
    teamId,
    confidence,
  }: findKeyResultByConfidenceInput): Promise<any> {
    const sql = this.postgres.getSqlInstance()
    const [confidenceMin, confidenceMax] = confidence === ConfidenceTag.BARRIER ? [-1, -1] : [0, 32]

    const [queryOutput] = await sql<keyResultFromMCContextOutputTable[]>`
      WITH latest_checkin AS (
        SELECT DISTINCT ON (krci.key_result_id, krci.created_at) krci.*
        FROM key_result kr
        INNER JOIN objective o ON o.id = kr.objective_id
        INNER JOIN cycle c ON c.id = o.cycle_id
        INNER JOIN team t ON t.id = kr.team_id
        INNER JOIN key_result_check_in krci ON kr.id = krci.key_result_id
        WHERE kr.team_id = ${teamId}
          AND t.owner_id = ${userId}
          AND kr.mode = ${KeyResultMode.PUBLISHED}
          AND o.mode = ${ObjectiveMode.PUBLISHED}
          AND c.active = true
        ORDER BY krci.key_result_id, krci.created_at DESC
        LIMIT 1
      )
      SELECT ck.key_result_id AS id
      FROM latest_checkin ck
      LEFT JOIN key_result_comment krc ON krc.key_result_id = ck.key_result_id
        AND krc.user_id = ${userId}
        AND krc.created_at > ck.created_at
      WHERE krc.id IS NULL
        AND ck.confidence BETWEEN ${confidenceMin} AND ${confidenceMax};
    `
    return queryOutput
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
