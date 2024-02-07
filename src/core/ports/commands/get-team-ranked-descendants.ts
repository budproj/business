import { FindConditions } from 'typeorm'

import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { Status } from '@core/interfaces/status.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

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
      `
      WITH key_result_status AS
        (SELECT kr.id,
                CASE
                    WHEN lci.created_at < CURRENT_DATE - interval '6' DAY THEN TRUE
                    ELSE FALSE
                END AS is_outdated,
                c.active,
                lci.created_at AS last_check_in_date,
                CASE
                    WHEN lci.value = kr.goal THEN 100
                    WHEN kr.goal = kr.initial_value THEN 0
                    ELSE 100 * (coalesce(lci.value, 0) - kr.initial_value) / (kr.goal - kr.initial_value)
                END AS progress,
                lci.confidence,
                kr.objective_id,
                kr.team_id
        FROM public.key_result kr
        LEFT JOIN key_result_latest_check_in lci ON kr.id = lci.key_result_id
        JOIN public.objective o ON kr.objective_id = o.id
        JOIN public.cycle c ON o.cycle_id = c.id),
          objective_status AS
        (SELECT krs.objective_id,
                krs.team_id,
                bool_or(is_outdated) AS is_outdated,
                max(last_check_in_date) AS last_check_in_date,
                avg(progress) AS progress,
                min(confidence) AS confidence
        FROM key_result_status krs
        JOIN objective o ON krs.objective_id = o.id
        JOIN CYCLE cy ON o.cycle_id = cy.id
        WHERE o.mode = 'PUBLISHED'
          AND cy.active IS TRUE
        GROUP BY krs.objective_id,
                  krs.team_id),
          team_status AS
        (SELECT os.team_id,
                bool_or(is_outdated) AS is_outdated,
                max(last_check_in_date) AS last_check_in_date,
                avg(progress) AS progress,
                min(confidence) AS confidence
        FROM objective_status os
        GROUP BY os.team_id),
          team_descending_by_status AS
        (SELECT ts.*
        FROM team_status ts
        JOIN team_company tc ON ts.team_id = tc.team_id
        WHERE tc.company_id = $1
        ORDER BY progress DESC)
      SELECT t.*
      FROM team t
      JOIN team_descending_by_status tdbs ON t.id = tdbs.team_id;
    `,
      [teamID],
    )

    return rows.map((row) => {
      return Object.assign(new Team(), {
        name: row.name,
        updatedAt: row.updated_at,
        ownerId: row.owner_id,
        createdAt: row.created_at,
        id: row.id,
        description: row.description,
        gender: row.gender,
        parentId: row.parent_id,
      })
    })
  }
}
