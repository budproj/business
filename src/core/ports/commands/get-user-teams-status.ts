import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'

import { Command } from './base.command'
// Import { Stopwatch } from '@lib/logger/pino.decorator'

export interface GetTeamStatusOptions extends GetStatusOptions {
  cycleFilters?: Partial<CycleInterface>
}

export class GetUserTeamsStatus extends Command<Status[]> {
  static isActive(keyResults: any[]): boolean {
    return keyResults.some((keyResult) => keyResult?.objective?.cycle?.active)
  }

  // @Stopwatch()
  public async execute(userID: string): Promise<any[]> {
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
      SELECT t.id, t.name, to_json(ts.*) as status, 
      ts.progress - ts.previous_progress as delta_progress,
      ts.confidence - ts.previous_confidence as delta_confidence,
      to_json(cqac.*) as "tacticalCycle",
            to_json(lcibt.*) AS last_check_in
      FROM team_status ts
      join team t on ts.team_id = t.id
      join team_current_quarterly_active_cycle cqac on t.id = cqac.t_id
      join team_company tc on ts.team_id = tc.team_id
      join user_company uc on tc.company_id = uc.company_id
      JOIN latest_check_in_by_team_with_user lcibt ON ts.team_id = lcibt.team_id
 where uc.user_id = $1
      `,
      [userID],
    )
    const blah = rows.map((row) => {
      const deltaData = {
        progress: row.delta_progress,
        confidence: row.delta_confidence,
      }
      return {
        id: row.id,
        name: row.name,
        latestCheckIn: row.last_check_in,
        status: row.status,
        delta: deltaData,
        tacticalCycle: row.tacticalCycle,
      }
    })

    return blah // Sipa nao precisa

    // If (Array.isArray(rows) && rows.length === 0) {
    //   return [
    //     {
    //       isOutdated: true,
    //       isActive: true,
    //       progress: 0,
    //       confidence: 100,
    //     },
    //   ]
    // }

    // const latest_check_in: KeyResultCheckIn = new KeyResultCheckIn()
    // latest_check_in.id = rows.last_check_in?.id
    // latest_check_in.value = rows[0].last_check_in?.value
    // latest_check_in.confidence = rows[0].last_check_in?.confidence
    // latest_check_in.createdAt = new Date(rows[0].last_check_in?.created_at)
    // latest_check_in.keyResultId = rows[0].last_check_in?.key_result_id
    // latest_check_in.userId = rows[0].last_check_in?.user_id
    // latest_check_in.comment = rows[0].last_check_in?.comment
    // latest_check_in.parentId = rows[0].last_check_in?.parent_id
    // latest_check_in.previousState = rows[0].last_check_in?.previous_state

    // const toReturn: Status = {
    //   isOutdated: rows[0].is_outdated,
    //   confidence: rows[0].confidence,
    //   progress: rows[0].progress,
    //   reportDate: new Date(rows[0].last_check_in?.created_at),
    //   isActive: rows[0].is_active,
    //   latestCheckIn: latest_check_in,
    // }
    // return blah
  }
}
