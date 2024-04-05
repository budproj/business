import { uniqBy } from 'lodash'

import { Status } from '@core/interfaces/status.interface'
// eslint-disable-next-line import/order
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

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
          
          select kr.*, to_json(krs.*) as status, to_json(lci.*) as latest_check_in from key_result kr 
      join key_result_status krs on kr.id = krs.id
      left join latest_check_in_by_kr_with_user lci on kr.id = lci.key_result_id
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
    
    select kr.*, to_json(krs.*) as status, to_json(lci.*) as latest_check_in from key_result kr 
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

    return allKeyResult.map((row) => {
      const latest_check_in: KeyResultCheckIn = new KeyResultCheckIn()
      latest_check_in.id = row.latest_check_in?.id
      latest_check_in.value = row.latest_check_in?.value
      latest_check_in.confidence = row.latest_check_in?.confidence
      latest_check_in.createdAt = new Date(row.latest_check_in?.created_at)
      latest_check_in.keyResultId = row.latest_check_in?.key_result_id
      latest_check_in.userId = row.latest_check_in?.user_id
      latest_check_in.comment = row.latest_check_in?.comment
      latest_check_in.parentId = row.latest_check_in?.parent_id
      latest_check_in.previousState = row.latest_check_in?.previous_state
      latest_check_in.user = row.latest_check_in?.user
      const row_status: Status = {
        progress: row?.status?.progress ?? 0,
        confidence: row?.status?.confidence ?? 0,
        isOutdated: row.status?.is_outdated,
        reportDate: new Date(row.latest_check_in?.created_at),
        isActive: row.is_active,
        latestCheckIn: latest_check_in,
      }
      return {
        title: row.title,
        goal: row.goal,
        initialValue: row.initial_value,
        createdAt: row.created_at,
        owner: row.owner,
        supportTeamMembers: row.supportTeamMembers,
        objective: row.objective,
        format: row.format,
        type: row.type,
        updatedAt: row.updated_at,
        ownerId: row.owner_id,
        objectiveId: row.objective_id,
        teamId: row.team_id,
        description: row.description,
        mode: row.mode,
        lastUpdatedBy: row.last_updated_by,
        commentCount: row.comment_count,
        id: row.id,
        statuses: row_status,
      }
    })
  }
}
