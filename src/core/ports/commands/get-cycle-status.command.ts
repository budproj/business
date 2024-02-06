import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Cacheable } from '@lib/cache/cacheable.decorator'
import { Stopwatch } from '@lib/logger/pino.decorator'

export class GetCycleStatusCommand extends BaseStatusCommand {
  @Cacheable(
    (cycleID, options) => [cycleID, Math.floor(options?.date?.getTime() / (1000 * 60 * 60))],
    60 * 60,
  )
  @Stopwatch({ omitArgs: true })
  public async execute(
    cycleID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const row = await this.core.entityManager.query(
      `
      WITH latest_check_in AS
        (SELECT DISTINCT ON (krci.key_result_id) *
        FROM public.key_result_check_in krci
        ORDER BY krci.key_result_id,
                  krci.created_at DESC),
      latest_check_in_by_cycle AS
        (SELECT DISTINCT ON (o.cycle_id) krci.*, o.cycle_id
        FROM public.key_result_check_in krci
        JOIN public.key_result kr ON krci.key_result_id = kr.id
        JOIN public.objective o ON kr.objective_id = o.id
        WHERE o.mode = 'PUBLISHED'
          AND o.team_id IS NOT NULL 
        ORDER BY o.cycle_id,
                  krci.created_at DESC),
          key_result_status AS
        (SELECT kr.id,
                kr.title,
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
                    ELSE greatest(least(100 * (coalesce(lci.value, 0) - kr.initial_value) / (kr.goal - kr.initial_value), 100), 0)
                END AS progress,
                lci.confidence,
                kr.objective_id,
                kr.team_id,
                c.id AS cycle_id
        FROM public.key_result kr
        LEFT JOIN latest_check_in lci ON kr.id = lci.key_result_id
        JOIN public.objective o ON kr.objective_id = o.id
        JOIN public.cycle c ON o.cycle_id = c.id
        WHERE o.mode = 'PUBLISHED'
          AND o.team_id IS NOT NULL ),
          objective_status AS
        (SELECT krs.objective_id,
                krs.team_id,
                cy.id AS cycle_id,
                cy.team_id AS company_id,
                bool_and(is_outdated) AS is_outdated,
                bool_or(is_active) AS is_active,
                least(greatest(avg(progress), 0), 100) AS progress,
                min(confidence) AS confidence
        FROM key_result_status krs
        JOIN objective o ON krs.objective_id = o.id
        JOIN CYCLE cy ON o.cycle_id = cy.id
        WHERE o.mode = 'PUBLISHED'
          AND cy.active IS TRUE
        GROUP BY krs.objective_id,
                  krs.team_id,
                  cy.id,
                  cy.team_id),
          cycle_status AS
        (SELECT o.cycle_id,
                o.company_id,
                bool_and(is_outdated) AS is_outdated,
                bool_or(is_active) AS is_active,
                least(greatest(avg(progress), 0), 100) AS progress,
                min(confidence) AS confidence
        FROM objective_status o
        WHERE o.team_id IS NOT NULL
        GROUP BY o.cycle_id,
                  o.company_id)
      SELECT cs.*,
            to_json(lcibc.*) AS latest_check_in
      FROM cycle_status cs
      JOIN latest_check_in_by_cycle lcibc ON cs.cycle_id = lcibc.cycle_id
      WHERE cs.cycle_id = $1
      `,
      [cycleID],
    )

    const latestCheckInNew = new KeyResultCheckIn()
    latestCheckInNew.id = row[0].latest_check_in.id
    latestCheckInNew.value = row[0].latest_check_in.value
    latestCheckInNew.confidence = row[0].latest_check_in.confidence
    latestCheckInNew.comment = row[0].latest_check_in.comment
    latestCheckInNew.createdAt = row[0].latest_check_in.created_at
    latestCheckInNew.keyResultId = row[0].latest_check_in.id
    latestCheckInNew.userId = row[0].latest_check_in.id
    latestCheckInNew.parentId = row[0].latest_check_in.parent_id
    latestCheckInNew.previousState = row[0].latest_check_in.previous_state

    console.log('1. blah blah2')
    console.log({
      isOutdated: row[0].is_outdated,
      isActive: row[0].is_active,
      latestCheckIn: latestCheckInNew,
      reportDate: row[0].latest_check_in.created_at,
      progress: row[0].progress,
      confidence: row[0].confidence,
    })
    return {
      isOutdated: row[0].is_outdated,
      isActive: row[0].is_active,
      latestCheckIn: latestCheckInNew,
      reportDate: row[0].latest_check_in.created_at,
      progress: row[0].progress,
      confidence: row[0].confidence,
    }
  }
}
