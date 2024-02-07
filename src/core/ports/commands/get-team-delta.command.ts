import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { BaseDeltaCommand } from '@core/ports/commands/base-delta.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'
import { GetTeamStatusOptions } from '@core/ports/commands/get-team-status.command'

export class GetTeamDeltaCommand extends BaseDeltaCommand {
  private readonly getTeamStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeamStatus = this.factory.buildCommand<Status>('get-team-status')
  }

  public async execute(teamID: string, options?: GetTeamStatusOptions): Promise<Delta> {
    const comparisonDate = this.getComparisonDate()
    const row = await this.core.entityManager.query(
      `
      WITH 
          latest_check_in_week_before AS
        (SELECT DISTINCT ON (krci.key_result_id) *
        FROM public.key_result_check_in krci
        WHERE krci.created_at < $2
        ORDER BY krci.key_result_id,
                  krci.created_at DESC),
          key_result_status AS
        (SELECT kr.id,
                least(greatest(CASE
                                  WHEN lci.value = kr.goal THEN 100
                                  WHEN kr.goal = kr.initial_value THEN 0
                                  ELSE 100 * (coalesce(lci.value, 0) - kr.initial_value) / (kr.goal - kr.initial_value)
                              END, 0), 100) AS progress,
                least(greatest(CASE
                                  WHEN lciwb.value = kr.goal THEN 100
                                  WHEN kr.goal = kr.initial_value THEN 0
                                  ELSE 100 * (coalesce(lciwb.value, 0) - kr.initial_value) / (kr.goal - kr.initial_value)
                              END, 0), 100) AS previous_progress,
                lci.confidence,
                lciwb.confidence AS previous_confidence,
                kr.objective_id,
                kr.team_id
        FROM public.key_result kr
        LEFT JOIN key_result_latest_check_in lci ON kr.id = lci.key_result_id
        LEFT JOIN latest_check_in_week_before lciwb ON kr.id = lciwb.key_result_id
        JOIN public.objective o ON kr.objective_id = o.id
        JOIN public.cycle c ON o.cycle_id = c.id),
          objective_status AS
        (SELECT krs.objective_id,
                krs.team_id,
                cy.id AS cycle_id,
                cy.team_id AS company_id,
                avg(progress) AS progress,
                avg(previous_progress) AS previous_progress,
                min(confidence) AS confidence,
                min(previous_confidence) AS previous_confidence
        FROM key_result_status krs
        JOIN objective o ON krs.objective_id = o.id
        JOIN CYCLE cy ON o.cycle_id = cy.id
        WHERE o.mode = 'PUBLISHED'
          AND cy.active IS TRUE
        GROUP BY krs.objective_id,
                  krs.team_id,
                  cy.id,
                  cy.team_id),
          team_status AS
        (SELECT o.team_id,
                o.company_id,
                greatest(avg(progress), 0) AS progress,
                greatest(avg(previous_progress), 0) AS previous_progress,
                min(confidence) AS confidence,
                min(previous_confidence) AS previous_confidence
        FROM objective_status o
        WHERE o.team_id IS NOT NULL
        GROUP BY o.team_id,
                  o.company_id)
      SELECT *
      FROM team_status ts
      WHERE ts.team_id = $1
      `,
      [teamID, comparisonDate],
    )
    if (row[0]) {
      return {
        progress: row[0].progress - row[0].previous_progress,
        confidence: row[0].confidence - row[0].previous_confidence,
      }
    }

    return {
      progress: 0,
      confidence: 0,
    }
  }
}