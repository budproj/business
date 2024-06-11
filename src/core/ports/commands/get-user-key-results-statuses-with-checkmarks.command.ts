import { Status } from '@core/interfaces/status.interface'
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
      WITH latest_check_in_by_kr AS (
        SELECT DISTINCT ON (kr.id) krci.*
        FROM public.key_result_check_in krci
        JOIN public.key_result kr ON krci.key_result_id = kr.id
        ORDER BY kr.id, krci.created_at DESC
      ),
      latest_check_in_by_kr_with_user AS (
        SELECT lci.*
        FROM latest_check_in_by_kr lci
        JOIN "user" u ON lci.user_id = u.id
      ),
      aggregated_check_marks AS (
        SELECT krcm.key_result_id,
              jsonb_agg(to_jsonb(krcm.*)) AS check_marks
        FROM key_result_check_mark krcm
        WHERE krcm.assigned_user_id = $1
        GROUP BY krcm.key_result_id
      ),
      key_results_with_check_marks AS (
        SELECT kr.*, 
              to_jsonb(krs.*) AS status,
              to_jsonb(lci.*) AS latest_check_in,
              acm.check_marks
        FROM key_result kr
        JOIN key_result_status krs ON kr.id = krs.id
        LEFT JOIN latest_check_in_by_kr_with_user lci ON kr.id = lci.key_result_id
        LEFT JOIN aggregated_check_marks acm ON kr.id = acm.key_result_id
      )
      SELECT DISTINCT krwcm.*
      FROM key_results_with_check_marks krwcm
      JOIN key_result_check_mark krcm ON krwcm.id = krcm.key_result_id
      LEFT JOIN key_result_support_team_members_user krstu ON krwcm.id = krstu.key_result_id  
      WHERE krwcm.mode = $2
      AND krwcm.team_id IS NOT NULL
      AND (
            krwcm.owner_id = $1 OR 
            krstu.user_id = $1 OR
            krcm.assigned_user_id = $1
      )
      ORDER BY krwcm.id

`,
      [userID, filters.mode],
    )

    return keyResults.map((row) => {
      const latest_check_in = {
        id: row.latest_check_in?.id,
        value: row.latest_check_in?.value,
        confidence: row.latest_check_in?.confidence,
        createdAt: new Date(row.latest_check_in?.created_at),
        keyResultId: row.latest_check_in?.key_result_id,
        userId: row.latest_check_in?.user_id,
        comment: row.latest_check_in?.comment,
        parentId: row.latest_check_in?.parent_id,
        previousState: row.latest_check_in?.previous_state,
        user: row.latest_check_in?.user,
      }

      const row_status: Status = {
        progress: row?.status?.progress ?? 0,
        confidence: row?.status?.confidence ?? 0,
        isOutdated: row.status?.is_outdated,
        reportDate: new Date(row.latest_check_in?.created_at),
        isActive: row.is_active,
        latestCheckIn: latest_check_in,
      }

      const check_marks = row.check_marks
        ? row.check_marks.map((checkMark) => {
            return {
              id: checkMark.id,
              state: checkMark.state,
              userId: checkMark.user_id,
              createdAt: checkMark.created_at,
              updatedAt: checkMark.updated_at,
              description: checkMark.description,
              keyResultId: checkMark.key_result_id,
              assignedUserId: checkMark.assigned_user_id,
            }
          })
        : []

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
        checkMarks: check_marks,
      }
    })
  }
}
