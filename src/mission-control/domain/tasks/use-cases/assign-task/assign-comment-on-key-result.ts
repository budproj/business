import { Injectable } from '@nestjs/common'

import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
import { Stopwatch } from '@lib/logger/pino.decorator'
import { Task } from '@prisma/mission-control/generated'

import { PostgresJsService } from '../../../../infra/database/postgresjs/postgresjs.service'
import {
  COMMENT_KR_TASK_TEMPLATE_ID,
  COMMENT_KR_TASK_SCORE,
  COMMENT_KR_TASK_SINGLE_SUBTASK,
} from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignCommentOnKeyResultTask implements TaskAssigner {
  constructor(private readonly postgres: PostgresJsService) {}

  @Stopwatch({ includeReturn: true })
  async assign({ teamId, userId, weekId }: TaskScope): Promise<Task[]> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const keyResults = await this.postgres.getSqlInstance()`
      SELECT kr.id AS id
      FROM key_result kr
      INNER JOIN objective o ON o.id = kr.objective_id
      INNER JOIN cycle c ON c.id = o.cycle_id
      WHERE kr.team_id = ${teamId}
        AND kr.mode = ${KeyResultMode.PUBLISHED}
        AND o.mode = ${ObjectiveMode.PUBLISHED}
        AND c.active = true
        AND kr.id = (
          SELECT kc.key_result_id
          FROM key_result_comment kc
          WHERE kc.created_at = (
            SELECT MAX(created_at)
            FROM key_result_comment
            WHERE key_result_id = kr.id
              AND kc.user_id < ${userId}
              AND kc.created_at < ${sevenDaysAgo}
          )
        )
    `
    if (keyResults.length === 0) return []

    return [
      {
        userId,
        teamId,
        weekId,
        templateId: COMMENT_KR_TASK_TEMPLATE_ID,
        score: COMMENT_KR_TASK_SCORE,
        availableSubtasks: [COMMENT_KR_TASK_SINGLE_SUBTASK],
        completedSubtasks: [],
      },
    ]
  }
}
