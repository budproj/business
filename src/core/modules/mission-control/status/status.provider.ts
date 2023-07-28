import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResultStateInterface } from '@core/modules/key-result/interfaces/key-result-state.interface'
import { DEFAULT_CONFIDENCE, DEFAULT_PROGRESS } from '@core/modules/team/team.constants'
import { AggregateExecutorFactory } from '@core/modules/workspace/aggregate-executor.factory'
import { KeyResultLatestCheckInSegmentParams, OkrMode } from '@core/modules/workspace/segment.factory'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { Filters, Status, StatusWithOnly } from './status.aggregate'
import { StatusAggregator } from './status.aggregator'

type RawStatusLatestCheckIn = {
  id: string
  value: number
  confidence: number
  created_at: string
  key_result_id: string
  user_id: string
  user_full_name: string
  comment: string
  parent_id: string
  previous_state: KeyResultStateInterface
  objective_id: string
  cycle_id: string
  team_id: string
}

@Injectable()
export class StatusProvider {
  private readonly logger = new Logger(StatusProvider.name)

  constructor(private readonly executorFactory: AggregateExecutorFactory) {}

  @Stopwatch()
  async aggregate<T extends Status, K extends keyof T>({
    aggregator,
    since,
    okrType,
    cycleIsActive,
    include,
  }: Filters<T, K> & { aggregator: StatusAggregator }): Promise<StatusWithOnly<K, T>> {
    const executor = this.executorFactory.newInstance<Status>()

    const mode: OkrMode[] = ['published', 'completed']

    const params: KeyResultLatestCheckInSegmentParams = {
      createdAfter: since,
      keyResult: {
        mode,
        type: okrType,
        createdBefore: since,
        objective: {
          mode,
          type: okrType,
          cycle: {
            isActive: cycleIsActive,
            startBefore: new Date(),
          },
        },
      },
    }

    const included = (key: keyof T) => (include as Array<keyof T>)?.includes(key)

    if (included('progress')) {
      const progressKey = aggregator.averageProgress(params)

      executor.number(progressKey, (progress) => {
        this.logger.log(`Extracted key ${progressKey} = %o`, progress)
        return { progress: progress ?? DEFAULT_PROGRESS }
      })
    }

    if (included('confidence')) {
      const confidenceKey = aggregator.minConfidence(params)

      executor.number(confidenceKey, (confidence) => {
        this.logger.log(`Extracted key ${confidenceKey} = %o`, confidence)
        return { confidence: confidence ?? DEFAULT_CONFIDENCE }
      })
    }

    if (included('isActive')) {
      const isActiveKey = aggregator.isActive(params.keyResult)

      executor.boolean(isActiveKey, (isActive) => {
        this.logger.log(`Extracted key ${isActiveKey} = %o`, isActive)
        return { isActive: isActive ?? true }
      })
    }

    if (included('isOutdated')) {
      const isOutdatedKey = aggregator.isOutdated(params)

      executor.boolean(isOutdatedKey, (isOutdated) => {
        this.logger.log(`Extracted key ${isOutdatedKey} = %o`, isOutdated)
        return { isOutdated: isOutdated ?? false }
      })
    }

    if (included('latestCheckIn')) {
      const latestCheckInKey = aggregator.latestCheckIn(params)

      executor.addExtractor<RawStatusLatestCheckIn | null>(latestCheckInKey, (latestCheckIn) => {
        this.logger.log(`Extracted key ${latestCheckInKey} = %o`, latestCheckIn)
        if (!latestCheckIn) {
          return {}
        }

        return {
          latestCheckIn: {
            id: latestCheckIn.id,
            createdAt: new Date(latestCheckIn.created_at),
            value: latestCheckIn.value,
            confidence: latestCheckIn.confidence,
            keyResultId: latestCheckIn.key_result_id,
            userId: latestCheckIn.user_id,
            comment: latestCheckIn.comment,
            parentId: latestCheckIn.parent_id,
            previousState: latestCheckIn.previous_state,
            user: {
              id: latestCheckIn.user_id,
              fullName: latestCheckIn.user_full_name,
            },
          },
        }
      })
    }

    return executor.execute(aggregator.getQuery())
  }
}
