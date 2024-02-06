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
      with latest_check_in as (
        select distinct on (krci.key_result_id) * from public.key_result_check_in krci
        order by krci.key_result_id, krci.created_at desc
      ),
      latest_check_in_by_team AS
        (SELECT DISTINCT ON (o.team_id) krci.*, o.team_id
        FROM public.key_result_check_in krci
        JOIN public.key_result kr ON krci.key_result_id = kr.id
        JOIN public.objective o ON kr.objective_id = o.id
        WHERE o.mode = 'PUBLISHED'
          AND o.team_id IS NOT NULL 
        ORDER BY o.team_id,
                  krci.created_at DESC),
      key_result_status as (
        select 
          kr.id, 
          case when lci.created_at < current_date - interval '6' day then true else false end as is_outdated,  
          case when lci.id is not null then true else false end as is_active,
          c.active,
          case 
            when lci.value = kr.goal then 100 
            when kr.goal = kr.initial_value then 0
          else
          100 * (coalesce(lci.value,0) - kr.initial_value) / (kr.goal - kr.initial_value) end as progress,
          case when lci.confidence is null then 100 else lci.confidence end as confidence,
          kr.objective_id,
          kr.team_id
        from public.key_result kr 
        left join latest_check_in lci on kr.id = lci.key_result_id
        join public.objective o on kr.objective_id  = o.id
        join public.cycle c on o.cycle_id = c.id
        --where lci.confidence <> '-100'
      ),
      objective_status as (
        select 
          krs.objective_id,
          krs.team_id,
          bool_and(is_outdated) as is_outdated,
          bool_or(is_active) as is_active,
          avg(progress) as progress,
          min(confidence) as confidence
        from key_result_status krs 
        join objective o on krs.objective_id = o.id
        join cycle cy on o.cycle_id = cy.id
        where o.mode = 'PUBLISHED' and cy.active is true
        group by krs.objective_id, krs.team_id
      ),
      team_status as (
        select 
          os.team_id,
          bool_and(is_outdated) as is_outdated,
          bool_or(is_active) as is_active,
          avg(progress) as progress,
          min(confidence) as confidence
        from objective_status os
        group by os.team_id
      )
      select ts.*, to_json(lcibt.*) as last_check_in from team_status ts join latest_check_in_by_team lcibt on ts.team_id = lcibt.team_id
        where ts.team_id = $1
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
