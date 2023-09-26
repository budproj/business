import { Injectable } from '@nestjs/common'

import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { ObjectiveMode } from '@core/modules/objective/enums/objective-mode.enum'
import { Stopwatch } from '@lib/logger/pino.decorator'
import { Task } from '@prisma/mission-control/generated'

import { PostgresJsService } from '../../../../infra/database/postgresjs/postgresjs.service'
import { EMPTY_DESCRIPTION_TASK_TEMPLATE_ID, EMPTY_DESCRIPTION_TASK_SCORE } from '../../constants'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

@Injectable()
export class AssignEmptyDescriptionTask implements TaskAssigner {
  constructor(private readonly postgres: PostgresJsService) {}

  @Stopwatch({ includeReturn: true })
  async assign({ userId, teamId, weekId }: TaskScope): Promise<Task[]> {
    const keyResults = await this.postgres.getSqlInstance()`
      SELECT kr.id AS id
      FROM key_result kr
      INNER JOIN objective o ON o.id = kr.objective_id
      INNER JOIN cycle c ON c.id = o.cycle_id
      WHERE kr.owner_id = ${userId}
        AND kr.team_id = ${teamId}
        AND kr.mode = ${KeyResultMode.PUBLISHED}
        AND (kr.description IS NULL OR kr.description = '')
        AND o.mode = ${ObjectiveMode.PUBLISHED}
        AND c.active = true;
    `

    if (keyResults.length === 0) return []
    const keyResultsIds = keyResults.map((keyResult) => keyResult.id)

    return [
      {
        userId,
        teamId,
        weekId,
        templateId: EMPTY_DESCRIPTION_TASK_TEMPLATE_ID,
        score: EMPTY_DESCRIPTION_TASK_SCORE,
        availableSubtasks: keyResultsIds,
        completedSubtasks: [],
      },
    ]
  }
}
