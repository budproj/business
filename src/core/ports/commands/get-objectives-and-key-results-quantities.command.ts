import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'
import { KeyResultProvider } from '@core/modules/key-result/key-result.provider';

type Confidences = Awaited<ReturnType<KeyResultProvider['getActiveConfidenceKeyResultsQuantity']>>;

type ObjectivesAndKeyResultQuantities = Confidences & {
  keyResultsQuantity: number
  objectivesQuantity: number
};

export class GetObjectivesAndKeyResultQuantities extends Command<ObjectivesAndKeyResultQuantities> {
  public async execute(user: UserInterface, teamId?: TeamInterface['id']): Promise<ObjectivesAndKeyResultQuantities> {
    let userReachableTeamsIds: Array<TeamInterface['id']> = []

    // 1. Define o escopo de times
    if (teamId) {
      // 1.1. Se o time foi definido, usa ele como escopo
      userReachableTeamsIds = [teamId]
    } else {
      // 1.2. Se não, usa os times que o usuário tem acesso
      const userCompanies = await this.core.team.getUserCompanies(user)
      const userCompanyIDs = userCompanies.map((company) => company.id)
      const userReachableTeams = await this.core.team.getDescendantsByIds(userCompanyIDs)
      userReachableTeamsIds = userReachableTeams.map((team) => team.id)
    }

    /*
    create view key_result_latest_check_in as (
      select distinct on ("key_result_id") *
      from "key_result_check_in"
      order by "key_result_id", "created_at" desc
    );

    create index on "cycle" ("active") where ("active" = true);

    create index on "objective" ("team_id");

    create view active_cycle_objective as (
        select o.*
        from "objective" o
        inner join "cycle" c on c.id = o."cycle_id"
        where c.active = true
    );

    create index on "key_result" ("objective_id");

    create view active_cycle_key_result as (
        select kr.*
        from "key_result" kr
        inner join "active_cycle_objective" o on o.id = kr."objective_id"
    );
     */

    const rows = await this.core.task.repository.query(`
      with segment_objective as (
        select * from "active_cycle_objective"
        where "team_id" in ($1)
      )
      select 'keyResultsQuantity' as "key",
             count(*) as "value"
      from segment_objective
      
      union all
      
      select 'objectivesQuantity' as "key",
             count(*) as "value"
      from "key_result" kr
      inner join segment_objective o on o.id = kr."objective_id"
      
      union all
      
      select ci.confidence::text as "key",
             count(*) as "value"
      from "key_result" kr
      inner join segment_objective o on o.id = kr."objective_id"
      inner join "key_result_latest_check_in" ci on ci."key_result_id" = kr.id
      group by ci.confidence;
    `, [userReachableTeamsIds]);

    return rows.reduce((acc, row) => ({
      ...acc,
      [row.key]: row.value,
    }), {});
  }
}
