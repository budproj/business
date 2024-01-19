import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'

import { KeyResultFormat } from '../enums/key-result-format.enum'
import { KeyResultMode } from '../enums/key-result-mode.enum'
import { KeyResultType } from '../enums/key-result-type.enum'
import { Author } from '../interfaces/key-result-author.interface'
import { KeyResultStateInterface } from '../interfaces/key-result-state.interface'

export type GetKeyResultsQuery = {
  key_result_id: string
  key_result_created_at: Date
  key_result_title: string
  key_result_initial_value: number
  key_result_goal: number
  key_result_format: KeyResultFormat
  key_result_type: KeyResultType
  key_result_updated_at: Date
  key_result_owner_id: string
  key_result_objective_id: string
  key_result_team_id?: string
  key_result_description?: string
  key_result_mode: KeyResultMode
  key_result_last_updated_by?: Author
  key_result_comment_count?: JSON
  objective_id: string
  objective_created_at: Date
  objective_title: string
  objective_description?: string
  objective_updated_at: Date
  objective_cycle_id: string
  objective_owner_id: string
  objective_team_id?: string
  objective_mode: ObjectiveMode
  cycle_id: string
  cycle_created_at: Date
  cycle_period: string
  cycle_cadence: Cadence
  cycle_active: boolean
  cycle_date_start: Date
  cycle_date_end: Date
  cycle_updated_at: Date
  cycle_team_id: string
  cycle_parent_id?: string
  check_in_id: string
  check_in_created_at: Date
  check_in_value: number
  check_in_confidence: number
  check_in_key_result_id: string
  check_in_user_id: string
  check_in_comment?: string
  check_in_parent_id?: string
  check_in_previous_state?: KeyResultStateInterface
}

export const toApplication = (entities: GetKeyResultsQuery[]) => {
  return entities.map((entity) => {
    return {
      id: entity.key_result_id,
      createdAt: entity.key_result_created_at,
      title: entity.key_result_title,
      initialValue: entity.key_result_initial_value,
      goal: entity.key_result_goal,
      format: entity.key_result_format,
      type: entity.key_result_type,
      updatedAt: entity.key_result_updated_at,
      ownerId: entity.key_result_owner_id,
      objectiveId: entity.key_result_objective_id,
      teamId: entity.key_result_team_id,
      description: entity.key_result_description,
      mode: entity.key_result_mode,
      lastUpdatedBy: entity.key_result_last_updated_by,
      commentCount: entity.key_result_comment_count,
      objective: {
        id: entity.objective_id,
        createdAt: entity.objective_created_at,
        title: entity.objective_title,
        description: entity.objective_description,
        updatedAt: entity.objective_updated_at,
        cycleId: entity.objective_cycle_id,
        ownerId: entity.objective_owner_id,
        teamId: entity.objective_team_id,
        mode: entity.objective_mode,
      },
      checkIns: [
        {
          id: entity.check_in_id,
          createdAt: entity.check_in_created_at,
          value: entity.check_in_value,
          confidence: entity.check_in_confidence,
          keyResultId: entity.check_in_key_result_id,
          userId: entity.check_in_user_id,
          comment: entity.check_in_comment,
          parentId: entity.check_in_parent_id,
          previousState: entity.check_in_previous_state,
        },
      ],
    }
  })
}
