import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

type Confidences = Awaited<ReturnType<KeyResultProvider['getActiveConfidenceKeyResultsQuantity']>>

type ObjectivesAndKeyResultQuantities = Confidences & {
  keyResultsQuantity: number
  objectivesQuantity: number
}

export class GetObjectivesAndKeyResultQuantities extends Command<ObjectivesAndKeyResultQuantities> {
  public async execute(
    user: UserInterface,
    teamId?: TeamInterface['id'],
  ): Promise<ObjectivesAndKeyResultQuantities> {
    const query = `
    with cte_scope as (
          select distinct team_id
          from user_company uc
                 inner join team_company tc on uc.company_id = tc.company_id
          where (cast($2 as uuid) is null and uc.user_id = $1)
             or (cast($2 as uuid) is not null and tc.team_id = cast($2 as uuid))
        ),
        cte_objective as (
          select * from "active_cycle_objective" o
          inner join cte_scope s on s.team_id = o.team_id
        )
        -- 1. Quantidade de objetivos
        select 'objectivesQuantity' as "key",
               count(*) as "value"
        from cte_objective
        
        union all

        -- 2. Quantidade de key results
        select 'keyResultsQuantity' as "key",
               count(*) as "value"
        from "key_result" kr
        inner join cte_objective o on o.id = kr."objective_id"
        
        union all

        -- 3. Quantidade de key results agrupados por confidence
        select case when 
        		ci.confidence = '200' then 'achieved'
        		when ci.confidence = '66' then 'medium' 
        		when ci.confidence = '32' then 'low'
        		when ci.confidence = '-1' then 'barrier'
        		when ci.confidence = '-100' then 'deprioritized' 
        		else 'high' end as "key",
               count(*) as "value"
        from "key_result" kr
        inner join cte_objective o on o.id = kr."objective_id"
        left join "key_result_latest_check_in" ci on ci."key_result_id" = kr.id
        where kr.mode = 'PUBLISHED'
        group by 1;
    `

    if (teamId) {
      const descendants = await this.core.team.getDescendantsByIds([teamId])

      const arrayOfTeamsWithRows = await Promise.all(
        descendants.map(async (team) => {
          return this.core.entityManager.query(query, [user.id, team.id])
        }),
      )
      const flattenArray = arrayOfTeamsWithRows.flat(1)
      console.log({ flattenArray })
      return flattenArray.reduce(
        (accumulator, row) => ({
          ...accumulator,
          [row.key]: Number(accumulator[row.key] || 0) + Number(row.value),
        }),
        {
          keyResultsQuantity: 0,
          objectivesQuantity: 0,
          high: 0,
          medium: 0,
          low: 0,
          barrier: 0,
          achieved: 0,
          deprioritized: 0,
        },
      )
    }

    const rows = await this.core.entityManager.query(query, [user.id, teamId])

    return rows.reduce(
      (accumulator, row) => ({
        ...accumulator,
        [row.key]: Number(row.value),
      }),
      {
        keyResultsQuantity: 0,
        objectivesQuantity: 0,
        high: 0,
        medium: 0,
        low: 0,
        barrier: 0,
        achieved: 0,
        deprioritized: 0,
      },
    )
  }
}
