import { GetStatusOptions } from '@core/interfaces/status.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'
// Import { Stopwatch } from '@lib/logger/pino.decorator'

export interface GetTeamStatusOptions extends GetStatusOptions {
  cycleFilters?: Partial<CycleInterface>
}

export class GetUserTeamsStatus extends Command<Team[]> {
  static isActive(keyResults: any[]): boolean {
    return keyResults.some((keyResult) => keyResult?.objective?.cycle?.active)
  }

  // @Stopwatch()
  public async execute(userID: string): Promise<Team[]> {
    const rows = await this.core.entityManager.query(
      `
      WITH latest_check_in_by_team AS
        (SELECT DISTINCT ON (o.team_id) krci.*,
                            o.team_id
        FROM public.key_result_check_in krci
        JOIN public.key_result kr ON krci.key_result_id = kr.id
        JOIN public.objective o ON kr.objective_id = o.id
        WHERE o.mode = 'PUBLISHED'
          AND o.team_id IS NOT NULL
        ORDER BY o.team_id,
                  krci.created_at DESC),
latest_check_in_by_team_with_user as (
select lci.*, concat('{"fullName": "', u.first_name, u.last_name, '"}')::json as user from latest_check_in_by_team lci join "user" u on lci.user_id = u.id)
      SELECT t.id,
      t.name,
      t.updated_at,
      t.owner_id,
      t.parent_id,
      to_json(u.*) as owner,
      to_json(ts.*) as status,
      ts.progress - ts.previous_progress as delta_progress,
      ts.confidence - ts.previous_confidence as delta_confidence,
      coalesce(tc.team_id = uc.company_id, false) as is_company,
      to_json(cqac.*) as "tacticalCycle",
            to_json(lcibt.*) AS last_check_in
      FROM team_status ts
      join team t on ts.team_id = t.id
      join team_current_quarterly_active_cycle cqac on t.id = cqac.t_id
      join team_company tc on ts.team_id = tc.team_id
      join user_company uc on tc.company_id = uc.company_id
      JOIN latest_check_in_by_team_with_user lcibt ON ts.team_id = lcibt.team_id
      JOIN "user" u on t.owner_id = u.id
 where uc.user_id = $1
      `,
      [userID],
    )

    return rows.map((row) => {
      const deltaData = {
        progress: row.delta_progress,
        confidence: row.delta_confidence,
      }
      return {
        id: row.id,
        name: row.name,
        isCompany: row.is_company,
        updatedAt: row.updated_at,
        ownerId: row.owner_id,
        parentId: row.parent_id,
        latestCheckIn: row.last_check_in,
        status: row.status,
        delta: deltaData,
        tacticalCycle: row.tacticalCycle,
      }
    })
  }
}
