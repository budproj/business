import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

type Options = {
  active?: boolean
  onlyOwnerKeyResults?: boolean
}

// Ainda não foi propriamnete testada, não achei onde é chamada
export class GetUserKeyResultsStatusesWithCheckMarksCommand extends Command<KeyResult[]> {
  public async execute(
    userID: string,
    filters?: KeyResultInterface,
    options?: Options,
  ): Promise<KeyResult[]> {
    const keyResults = await this.core.entityManager.query(
      `
      WITH latest_check_in_by_kr AS
            (SELECT DISTINCT ON (kr.id) krci.*
            FROM public.key_result_check_in krci
            JOIN public.key_result kr ON krci.key_result_id = kr.id
            ORDER BY kr.id,
                      krci.created_at DESC),
         latest_check_in_by_kr_with_user as (
          select lci.*, concat('{"fullName": "', u.first_name, u.last_name, '"}')::json as user from latest_check_in_by_kr lci join "user" u on lci.user_id = u.id)
          
          select kr.*, to_json(krs.*) as status, to_json(lci.*) as latest_check_in from key_result_check_mark krcm 
      join key_result kr on krcm.key_result_id = kr.id
      join key_result_status krs on kr.id = krs.id
      left join latest_check_in_by_kr_with_user lci on kr.id = lci.key_result_id
      where krcm.assigned_user_id = $1 
      and kr.mode = $2`,
      [userID, filters.mode],
    )
    return keyResults
  }
}
