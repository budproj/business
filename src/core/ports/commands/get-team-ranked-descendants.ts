import { FindConditions } from 'typeorm'

import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { Status } from '@core/interfaces/status.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'
// Alterar esse any para Team + latest Check in, mesma coisa no front
export class GetTeamRankedDescendantsCommand extends Command<Team[]> {
  private readonly getTeamStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeamStatus = this.factory.buildCommand<Status>('get-team-status')
  }

  public async execute(
    teamID: string,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const rows = await this.core.entityManager.query(
      `WITH latest_check_in_by_team AS
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
    SELECT t.*,
    to_json(ts.*) as status,
    to_json(lcibt.*) as latest_check_in,
    to_json(cqac.*) as "tacticalCycle",
    ts.progress - ts.previous_progress as delta_progress,
    ts.confidence - ts.previous_confidence as delta_confidence
    FROM team t
    JOIN team_company tc ON t.id = tc.team_id
    join team_current_quarterly_active_cycle cqac on t.id = cqac.t_id
    LEFT JOIN team_status ts ON ts.team_id = tc.team_id
    join latest_check_in_by_team_with_user lcibt ON t.id = lcibt.team_id
    WHERE t.parent_id IS NOT NULL AND tc.company_id = $1
    ORDER BY coalesce(progress, 0) DESC;
    `,
      [teamID],
    )

    return rows.map((row) => {
      const deltaData = {
        progress: row.delta_progress ?? 0,
        confidence: row.delta_confidence ?? 0,
      }
      const row_tactical_cycle = {
        dateStart: new Date(row.tacticalCycle.date_start),
        dateEnd: new Date(row.tacticalCycle.date_end),
        createdAt: new Date(row.tacticalCycle.created_at),
        updatedAt: new Date(row.tacticalCycle.updated_at),
        id: row.tacticalCycle.id,
        teamId: row.tacticalCycle.team_id,
        period: row.tacticalCycle.period,
        cadence: row.tacticalCycle.cadence,
        active: row.tacticalCycle.active,
        parentId: row.tacticalCycle.parent_id,
      }
      const latest_check_in: KeyResultCheckIn = new KeyResultCheckIn()
      latest_check_in.id = row.latest_check_in?.id
      latest_check_in.value = row.latest_check_in?.value
      latest_check_in.confidence = row.latest_check_in?.confidence
      latest_check_in.createdAt = new Date(row.latest_check_in?.created_at)
      latest_check_in.keyResultId = row.latest_check_in?.key_result_id
      latest_check_in.userId = row.latest_check_in?.user_id
      latest_check_in.comment = row.latest_check_in?.comment
      latest_check_in.parentId = row.latest_check_in?.parent_id
      latest_check_in.previousState = row.latest_check_in?.previous_state
      latest_check_in.user = row.latest_check_in?.user
      const row_status: Status = {
        progress: row?.status?.progress ?? 0,
        confidence: row?.status?.confidence ?? 0,
        isOutdated: row.is_outdated,
        reportDate: new Date(row.latest_check_in?.created_at),
        isActive: row.is_active,
        latestCheckIn: latest_check_in,
      }
      return {
        name: row.name,
        updatedAt: row.updated_at,
        ownerId: row.owner_id,
        createdAt: row.created_at,
        id: row.id,
        description: row.description,
        gender: row.gender,
        parentId: row.parent_id,
        statuses: row_status,
        deltas: deltaData,
        tacticalCycles: row_tactical_cycle,
      }
    })
  }
}
