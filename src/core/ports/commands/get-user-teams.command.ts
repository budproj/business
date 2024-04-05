import { Status } from '@core/interfaces/status.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'
// Import { Stopwatch } from '@lib/logger/pino.decorator'

export class GetUserTeams extends Command<Team[]> {
  static isActive(keyResults: any[]): boolean {
    return keyResults.some((keyResult) => keyResult?.objective?.cycle?.active)
  }

  // @Stopwatch()
  public async execute(userID: string): Promise<Team[]> {
    const rows = await this.core.entityManager.query(
      `
      SELECT
        t.id,
        t.name,
        to_json(ts.*) as status,
        to_json(u.*) as owner,
        t.description,
        t.updated_at,
        t.owner_id,
        t.created_at,
        t.parent_id,
        ts.team_id = tc.company_id as is_company
      FROM
        team t
        left join team_status ts on t.id = ts.team_id
        join team_company tc on t.id = tc.team_id
        join team_users_user tuu on t.id = tuu.team_id
        join "user" u on t.owner_id = u.id
      where
        tuu.user_id = $1
      `,
      [userID],
    )
    return rows.map((row) => {
      const row_status: Status = {
        progress: row?.status?.progress ?? 0,
        confidence: row?.status?.confidence ?? 0,
        isOutdated: row.is_outdated,
        reportDate: new Date(row.latest_check_in?.created_at),
        isActive: row.is_active,
      }
      return {
        id: row.id,
        name: row.name,
        description: row.description,
        statuses: row_status,
        is_company: row.is_company ?? false,
        updatedAt: row.updated_at,
        ownerId: row.owner_id,
        owner: row.owner,
        createdAt: row.created_at,
        gender: row.gender,
        parentId: row.parent_id,
      }
    })
  }
}
