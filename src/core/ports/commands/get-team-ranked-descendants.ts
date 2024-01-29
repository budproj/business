import { zip, unzip, sortBy, reverse } from 'lodash'
import { FindConditions } from 'typeorm'

import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { Status } from '@core/interfaces/status.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'
import { GetTeamStatusOptions } from '@core/ports/commands/get-team-status.command'

export class GetTeamRankedDescendantsCommand extends Command<Team[]> {
  private readonly getTeamStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeamStatus = this.factory.buildCommand<Status>('get-team-status')
  }
  // O objetivo é retornar o status dos descendentes de um time
  // O que é o rankear? Estão ordenando pelo progresso do time
  // Pelo que entendi, é uma query recursiva para fazer o ranking da primeira página
  // Sendo que o Status englobal:
  // progress: number
  // confidence: number
  // isOutdated: boolean
  // isActive?: boolean
  // reportDate?: Date
  // latestCheckIn?: KeyResultCheckInInterface
  // allUpToDateCheckIns?: KeyResultCheckInInterface[]
  // checkmarks?: KeyResultCheckMarkInterface[]
  // total?: number

  static rankTeamsByStatus(teams: Team[], status: Status[]): Team[] {
    const zippedTeams = zip(teams, status)
    const ascendingSortedPairs = sortBy(zippedTeams, ([_, status]) => status.progress)
    const descendingSortedPairs = reverse(ascendingSortedPairs)

    const [sortedTeams] = unzip(descendingSortedPairs) as [Team[]]

    return sortedTeams ?? []
  }

  public async execute(
    teamID: string,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const teamDescendants = await this.core.team.getDescendantsByIds([teamID], false, filters, queryOptions)
    const teamDescendantsStatus = await this.getTeamsStatus(teamDescendants)

    return GetTeamRankedDescendantsCommand.rankTeamsByStatus(teamDescendants, teamDescendantsStatus)
  }

  private async getTeamsStatus(teams: Team[]): Promise<Status[]> {
    const statusOptions: GetTeamStatusOptions = {
      cycleFilters: {
        active: true,
      },
    }
    // TODO: use a single command to get all statuses at once
    // select t.id, max(case when cy.active is true then 1 else 0 end) as is_active from dm_okr.dim__team t 
    // join dm_okr.dim__cycle cy on t.company_id = cy.team_id
    // group by t.id

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
      join team_company tc on ts.team_id = tc.team_id
      where tc.company_id = 'f6790108-2b16-4077-bed0-103fc38175dd'
    order by progress desc
    */
    const teamStatusPromises = teams.map(async (team) =>
      this.getTeamStatus.execute(team.id, statusOptions),
    )

    return Promise.all(teamStatusPromises)
  }
}
