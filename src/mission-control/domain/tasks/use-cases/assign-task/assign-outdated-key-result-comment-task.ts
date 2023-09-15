import { Injectable } from '@nestjs/common'

import { Task } from '@prisma/mission-control/generated'

import {
  OUTDATED_KEY_RESULT_COMMENT_TASK_SCORE,
  OUTDATED_KEY_RESULT_COMMENT_TEMPLATE_ID,
} from '../../constants'
import { CoreDomainRepository } from '../../repositories/core-domain-repository'
import { TaskScope } from '../../types'

import { TaskAssigner } from './base-scenario/task-assigner.abstract'

/** TASK SCOPE
 * Quem é elegível: Apenas para líderes do time
 * Condições para criação da task: 1+ Key-Results do time sem check-in nos últimos 7 dias
 * Ela é binária ou um agregado de subtasks: é um agregado de subtasks (1+ KRs do time estão outdated)
 * Qual ação completa/avança essa task: ao menos 1 comentário feito em um KR atrasado (kr do time que o cara é líder)
 */

@Injectable()
export class AssignOutdatedKeyResultCommentTask implements TaskAssigner {
  constructor(private readonly coreRepository: CoreDomainRepository) {}

  async assign(scope: TaskScope): Promise<Task[] | null> {
    // Buscar líder do time
    // A tarefa só é gerada caso scope === líder se não eu já return null

    // const keyResults: Array<Partial<KeyResultInterface>> =
    // await this.keyResultRepository.getManyWithOutdatedCheckin({
    //   ownerId: scope.userId,
    //   teamId: scope.teamId,
    //   mode: KeyResultMode.PUBLISHED,
    // })

    // if (keyResults.length === 0) return
    // const keyResultsIds = keyResults.map((keyResult) => keyResult.id)

    return [
      {
        userId: scope.userId,
        teamId: scope.teamId,
        weekId: scope.weekId,
        templateId: OUTDATED_KEY_RESULT_COMMENT_TEMPLATE_ID,
        score: OUTDATED_KEY_RESULT_COMMENT_TASK_SCORE,
        availableSubtasks: [],
        completedSubtasks: [],
      },
    ]
  }
}
