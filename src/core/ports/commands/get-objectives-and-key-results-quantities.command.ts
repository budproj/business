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

    const rows = await this.core.entityManager.query(
      `
        with cte_scope as (
          select distinct team_id
          from user_company uc
                 inner join team_company tc on uc.company_id = tc.company_id
          where ($2 is null and uc.user_id = $1)
             or ($2 is not null and tc.team_id = cast($2 as uuid))
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
        -- mudar para left join para trazer com "confidence == null" os que ainda não tiverem check-in
        inner join cte_objective o on o.id = kr."objective_id"
        
        union all

        -- 3. Quantidade de key results agrupados por confidence
        select ci.confidence::text as "key",
               count(*) as "value"
        from "key_result" kr
        inner join cte_objective o on o.id = kr."objective_id"
        inner join "key_result_latest_check_in" ci on ci."key_result_id" = kr.id
        group by ci.confidence;
      `,
      [user.id, teamId],
    )

    return rows.reduce(
      (accumulator, row) => ({
        ...accumulator,
        [row.key]: row.value,
      }),
      {},
    )
  }
}
