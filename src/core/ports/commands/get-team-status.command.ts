import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
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
    const anchorDate = new Date()
    const rawKeyResults = await this.getKeyResultsFromTeam(teamID, options)
    const keyResults = rawKeyResults.filter(
      (keyResult) => keyResult.objective.cycle.dateStart < anchorDate,
    )

    const [cycleCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(keyResults)

    const latestCheckIn = this.getLatestCheckInFromList(cycleCheckIns)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = GetTeamStatusCommand.isActive(keyResults)

    return {
      isOutdated,
      isActive,
      latestCheckIn,
      reportDate: latestCheckIn?.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
    }
    /* with latest_check_in as (
      select distinct on (krci.key_result_id) * from public.key_result_check_in krci
      order by krci.key_result_id, krci.created_at desc
    ),
    key_result_status as (
      select 
        kr.id, 
        case when lci.created_at < current_date - interval '6' day then true else false end as is_outdated,  
        c.active,
        -- lci.*,
        lci.created_at as last_check_in_date,
        case 
          when lci.value = kr.goal then 100 
          when kr.goal = kr.initial_value then 0
        else
        100 * (coalesce(lci.value,0) - kr.initial_value) / (kr.goal - kr.initial_value) end as progress,
        lci.confidence,
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
        bool_or(is_outdated) as is_outdated,
        max(last_check_in_date) as last_check_in_date,
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
        bool_or(is_outdated) as is_outdated,
        max(last_check_in_date) as last_check_in_date,
        avg(progress) as progress,
        min(confidence) as confidence
      from objective_status os
      group by os.team_id
    )
    select * from team_status ts 
      where ts.team_id = '3c239630-9167-431a-b502-b6fbecf5c09a' */
  } 

  private async getKeyResultsFromTeam(
    teamID: string,
    options: GetTeamStatusOptions,
  ): Promise<KeyResult[]> {
    const filters = {
      keyResult: {
        createdAt: options.date,
        mode: KeyResultMode.PUBLISHED,
      },
      team: {
        id: teamID,
      },
      cycle: options.cycleFilters,
    }
    const orderAttributes = this.zipEntityOrderAttributes(
      ['keyResultCheckIn'],
      [['createdAt']],
      [['DESC']],
    )

    const keyResults = await this.core.keyResult.getWithRelationFilters(filters, orderAttributes)

    return this.removeKeyResultCheckInsBeforeDate(keyResults, options.date)
  }
}
