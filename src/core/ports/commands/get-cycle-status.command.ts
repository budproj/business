import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
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
    const keyResults = (await this.getKeyResultsFromCycle(cycleID, options)) as any

    const filteredKeyResults = keyResults.filter((keyResult) => keyResult.teamId !== null)

    const [cycleCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(
      filteredKeyResults,
    )

    const latestCheckIn = this.getLatestCheckInFromList(cycleCheckIns)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = keyResults[0]?.objective?.cycle?.active ?? this.defaultStatus.isActive

    return {
      isOutdated,
      isActive,
      latestCheckIn,
      reportDate: latestCheckIn?.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
    }
  }

  private async getKeyResultsFromCycle(
    cycleID: string,
    options: GetStatusOptions,
  ): Promise<KeyResult[]> {
    const filters = {
      keyResult: {
        createdAt: options.date,
        mode: KeyResultMode.PUBLISHED,
      },
      cycle: {
        id: cycleID,
      },
    }
    const orderAttributes = this.zipEntityOrderAttributes(
      ['keyResultCheckIn'],
      [['createdAt']],
      [['DESC']],
    )

    /* with latest_check_in as (
      select distinct on (krci.key_result_id) * from public.key_result_check_in krci
      where krci.created_at < '2024-01-24'
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
        cy.id as cycle_id,
        cy.team_id as company_id,
        bool_or(is_outdated) as is_outdated,
        max(last_check_in_date) as last_check_in_date,
        avg(progress) as progress,
        min(confidence) as confidence
      from key_result_status krs 
      join objective o on krs.objective_id = o.id
      join cycle cy on o.cycle_id = cy.id
      where o.mode = 'PUBLISHED' and cy.active is true
      group by krs.objective_id, krs.team_id, cy.id, cy.team_id
    ),
    cycle_status as (
      select 
        o.cycle_id,
        o.company_id,
        bool_or(is_outdated) as is_outdated,
        max(last_check_in_date) as last_check_in_date,
        greatest(avg(progress), 0) as progress,
        min(confidence) as confidence
      from objective_status o
      where o.team_id is not null
      group by o.cycle_id, o.company_id
    )
    select * from cycle_status cs 
      where cs.company_id = 'f6790108-2b16-4077-bed0-103fc38175dd' */
      
    const keyResults = await this.core.keyResult.getWithRelationFilters(filters, orderAttributes)

    return this.removeKeyResultCheckInsBeforeDate(keyResults, options.date)
  } 
}
