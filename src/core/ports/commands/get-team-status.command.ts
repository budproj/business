import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Stopwatch } from '@lib/logger/pino.decorator'

export interface GetTeamStatusOptions extends GetStatusOptions {
  cycleFilters?: Partial<CycleInterface>
}

export class GetTeamStatusCommand extends BaseStatusCommand {
  static isActive(keyResults: any[]): boolean {
    return keyResults.some((keyResult) => keyResult?.objective?.cycle?.active)
  }

  @Stopwatch()
  public async execute(
    teamID: string,
    options: GetTeamStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const row = await this.core.entityManager.query(
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
          key_result_status AS
        (SELECT kr.id,
                CASE
                    WHEN lci.created_at < CURRENT_DATE - interval '6' DAY THEN TRUE
                    ELSE FALSE
                END AS is_outdated,
                CASE
                    WHEN lci.id IS NOT NULL THEN TRUE
                    ELSE FALSE
                END AS is_active,
                c.active,
                CASE
                    WHEN lci.value = kr.goal THEN 100
                    WHEN kr.goal = kr.initial_value THEN 0
                    ELSE greatest(least((100 * (coalesce(lci.value, 0) - kr.initial_value) / (kr.goal - kr.initial_value)), 100), 0)
                END AS progress,
                CASE
                    WHEN lci.confidence IS NULL THEN 100
                    ELSE lci.confidence
                END AS confidence,
                kr.objective_id,
                kr.team_id
        FROM public.key_result kr
        LEFT JOIN key_result_latest_check_in lci ON kr.id = lci.key_result_id
        JOIN public.objective o ON kr.objective_id = o.id
        JOIN public.cycle c ON o.cycle_id = c.id),
          objective_status AS
        (SELECT krs.objective_id,
                krs.team_id,
                bool_and(is_outdated) AS is_outdated,
                bool_or(is_active) AS is_active,
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
                bool_and(is_outdated) AS is_outdated,
                bool_or(is_active) AS is_active,
                avg(progress) AS progress,
                min(confidence) AS confidence
        FROM objective_status os
        GROUP BY os.team_id)
      SELECT ts.*,
            to_json(lcibt.*) AS last_check_in
      FROM team_status ts
      JOIN latest_check_in_by_team lcibt ON ts.team_id = lcibt.team_id
      WHERE ts.team_id = $1
      `,
      [teamID],
    )

    if (Array.isArray(row) && row.length === 0) {
      return {
        isOutdated: true,
        isActive: true,
        progress: 0,
        confidence: 100,
      }
    }

    const latest_check_in: KeyResultCheckIn = new KeyResultCheckIn()
    latest_check_in.id = row[0].last_check_in?.id
    latest_check_in.value = row[0].last_check_in?.value
    latest_check_in.confidence = row[0].last_check_in?.confidence
    latest_check_in.createdAt = new Date(row[0].last_check_in?.created_at)
    latest_check_in.keyResultId = row[0].last_check_in?.key_result_id
    latest_check_in.userId = row[0].last_check_in?.user_id
    latest_check_in.comment = row[0].last_check_in?.comment
    latest_check_in.parentId = row[0].last_check_in?.parent_id
    latest_check_in.previousState = row[0].last_check_in?.previous_state

    const toReturn: Status = {
      isOutdated: row[0].is_outdated,
      confidence: row[0].confidence,
      progress: row[0].progress,
      reportDate: new Date(row[0].last_check_in?.created_at),
      isActive: row[0].is_active,
      latestCheckIn: latest_check_in,
    }
    return toReturn
  }
}
