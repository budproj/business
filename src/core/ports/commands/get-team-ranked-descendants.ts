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
      with latest_check_in as (
        select distinct on (krci.key_result_id) * from public.key_result_check_in krci
        order by krci.key_result_id, krci.created_at desc
      ),
      key_result_status as (
        select 
          kr.id, 
          case when lci.created_at < current_date - interval '6' day then true else false end as is_outdated,  
          c.active,
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
      ),
      team_descending_by_status as (
        select ts.* from team_status ts 
          join team_company tc on ts.team_id = tc.team_id
          where tc.company_id = $1
        order by progress desc
    )
    select 
      t.* 
    from
      team t 
      join team_descending_by_status tdbs 
      on t.id = tdbs.team_id;
    `,
      [teamID],
    )

    return rows.map((row) => {
      const team = new Team()
      team.name = row.name
      team.updatedAt = row.updated_at
      team.ownerId = row.owner_id
      team.createdAt = row.created_at
      team.id = row.id
      team.description = row.description
      team.gender = row.gender
      team.parentId = row.parent_id
      return team
    })
  }
}
