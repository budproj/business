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

    const currentStatus = await this.getTeamStatus.execute(teamID, options)
    const previousStatus = await this.getTeamStatus.execute(teamID, {
      ...options,
      date: comparisonDate,
    })
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log(this.marshal(currentStatus, previousStatus))
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    console.log('HEY BRO')
    return this.marshal(currentStatus, previousStatus)
  }
}

/*
with latest_check_in as (
      select distinct on (krci.key_result_id) * from public.key_result_check_in krci
      where krci.created_at < '2024-01-30'
      order by krci.key_result_id, krci.created_at desc
    ),
    latest_check_in_week_before as (
      select distinct on (krci.key_result_id) * from public.key_result_check_in krci
      where krci.created_at < '2024-01-28'
      order by krci.key_result_id, krci.created_at desc
    ),
    key_result_status as (
      select 
        kr.id,
        least(
        	greatest(
		        case 
		          when lci.value = kr.goal then 100 
		          when kr.goal = kr.initial_value then 0
		        else
        			100 * (coalesce(lci.value,0) - kr.initial_value) / (kr.goal - kr.initial_value)
        		end,
        	0),
        100) as progress,	
        least(
        	greatest(
		        case 
		          when lciwb.value = kr.goal then 100 
		          when kr.goal = kr.initial_value then 0
		        else
        			100 * (coalesce(lciwb.value,0) - kr.initial_value) / (kr.goal - kr.initial_value)
        		end,
        	0),
        100) as previous_progress,			
        lci.confidence,
        lciwb.confidence as previous_confidence,
        kr.objective_id,
        kr.team_id
      from public.key_result kr 
      left join latest_check_in lci on kr.id = lci.key_result_id
      left join latest_check_in_week_before lciwb on kr.id = lciwb.key_result_id
      join public.objective o on kr.objective_id  = o.id
      join public.cycle c on o.cycle_id = c.id
      -- where lci.confidence <> '-100'
    ),
    objective_status as (
      select 
        krs.objective_id,
        krs.team_id,
        cy.id as cycle_id,
        cy.team_id as company_id,
        avg(progress) as progress,
        avg(previous_progress) as previous_progress,
        min(confidence) as confidence,
        min(previous_confidence) as previous_confidence
      from key_result_status krs 
      join objective o on krs.objective_id = o.id
      join cycle cy on o.cycle_id = cy.id
      where o.mode = 'PUBLISHED' and cy.active is true
      group by krs.objective_id, krs.team_id, cy.id, cy.team_id
    ),
    team_status as (
      select 
        o.team_id,
        o.company_id,
        greatest(avg(progress), 0) as progress,
        greatest(avg(previous_progress), 0) as previous_progress,
        min(confidence) as confidence,
        min(previous_confidence) as previous_confidence
      from objective_status o
      where o.team_id is not null
      group by o.team_id, o.company_id
    )
    select * from team_status ts 
      where ts.team_id = '0342b8f6-3a07-4f2b-a3fa-a3a8ca8fa61f'
*/