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
                  krci.created_at DESC)
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
