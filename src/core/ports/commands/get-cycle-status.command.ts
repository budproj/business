import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Stopwatch } from '@lib/logger/pino.decorator'

export class GetCycleStatusCommand extends BaseStatusCommand {
  @Stopwatch({ omitArgs: true })
  public async execute(
    cycleID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const row = await this.core.entityManager.query(
      `
      WITH latest_check_in_by_cycle AS
        (SELECT DISTINCT ON (o.cycle_id) krci.*, o.cycle_id
        FROM public.key_result_check_in krci
        JOIN public.key_result kr ON krci.key_result_id = kr.id
        JOIN public.objective o ON kr.objective_id = o.id
        WHERE o.mode = 'PUBLISHED'
          AND o.team_id IS NOT NULL 
        ORDER BY o.cycle_id,
                  krci.created_at DESC)
      SELECT cs.*,
            to_json(lcibc.*) AS latest_check_in
      FROM cycle_current_status cs
      JOIN latest_check_in_by_cycle lcibc ON cs.cycle_id = lcibc.cycle_id
      WHERE cs.cycle_id = $1
      `,
      [cycleID],
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
    latest_check_in.id = row[0].latest_check_in?.id
    latest_check_in.value = row[0].latest_check_in?.value
    latest_check_in.confidence = row[0].latest_check_in?.confidence
    latest_check_in.createdAt = new Date(row[0].latest_check_in?.created_at)
    latest_check_in.keyResultId = row[0].latest_check_in?.key_result_id
    latest_check_in.userId = row[0].latest_check_in?.user_id
    latest_check_in.comment = row[0].latest_check_in?.comment
    latest_check_in.parentId = row[0].latest_check_in?.parent_id
    latest_check_in.previousState = row[0].latest_check_in?.previous_state

    return {
      isOutdated: row[0].is_outdated,
      isActive: row[0].is_active,
      progress: row[0].progress,
      confidence: row[0].confidence,
      latestCheckIn: latest_check_in,
      reportDate: new Date(row[0].last_check_in?.created_at),
    }
  }
}
