import { intersectionBy, uniqBy } from 'lodash'

// Export interface Status {
//     progress: number
//     confidence: number
//     isOutdated: boolean
//     latestCheckIn?: KeyResultCheckInInterface
//     checkmarks?: KeyResultCheckMarkInterface[]
//   }

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

type Options = {
  active?: boolean
  onlyOwnerKeyResults?: boolean
}

export class GetUserKeyResultsStatusesCommand extends Command<KeyResult[]> {
  public async execute(
    userID: string,
    filters?: KeyResultInterface,
    options?: Options,
  ): Promise<KeyResult[]> {
    const rowsOwnerKeyResults = await this.core.entityManager.query(
      `
      WITH latest_check_in_by_kr AS
            (SELECT DISTINCT ON (kr.id) krci.*
            FROM public.key_result_check_in krci
            JOIN public.key_result kr ON krci.key_result_id = kr.id
            ORDER BY kr.id,
                      krci.created_at DESC),
         latest_check_in_by_kr_with_user as (
          select lci.*, concat('{"fullName": "', u.first_name, u.last_name, '"}')::json as user from latest_check_in_by_kr lci join "user" u on lci.user_id = u.id)
          
          select kr.*, to_json(krs.*) as status from key_result kr 
      join key_result_status krs on kr.id = krs.id
      left join latest_check_in_by_kr_with_user lci on kr.id = lci.key_result_id
      where 
      where kr.owner_id = $1 
      and mode = $2`,
      [userID, filters.mode],
    )
    const rowsSupportTeamKeyResults = await this.core.entityManager.query(
      `WITH latest_check_in_by_kr AS
    (SELECT DISTINCT ON (kr.id) krci.*
    FROM public.key_result_check_in krci
    JOIN public.key_result kr ON krci.key_result_id = kr.id
    ORDER BY kr.id,
              krci.created_at DESC),
    latest_check_in_by_kr_with_user as (
    select lci.*, concat('{"fullName": "', u.first_name, u.last_name, '"}')::json as user from latest_check_in_by_kr lci join "user" u on lci.user_id = u.id)
    
    select kr.*, to_json(krs.*) as status from key_result kr 
    join key_result_support_team_members_user krstmu on kr.id = krstmu.key_result_id 
    join key_result_status krs on kr.id = krs.id
    left join latest_check_in_by_kr_with_user lci on kr.id = lci.key_result_id
    where krstmu.user_id = $1 and mode = $2
`,
      [userID, filters.mode],
    )
    const allKeyResult = uniqBy([...rowsOwnerKeyResults, ...rowsSupportTeamKeyResults], 'id')
    if (options?.onlyOwnerKeyResults) {
      // Falta aplicar options, const keyResults = await this.applyOptions(ownedKeyResults, options)
      return rowsOwnerKeyResults
    }

    // Falta aplicar options aparentemente é só active, const keyResults = await this.applyOptions(allKeyResults, options)
    return allKeyResult
  }
}
