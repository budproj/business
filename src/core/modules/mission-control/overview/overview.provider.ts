import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { AggregateExecutorFactory } from '@core/modules/workspace/aggregate-executor.factory'
import { KeyResultLatestCheckInSegmentParams } from '@core/modules/workspace/segment.factory'

import { Filters, Overview, OverviewWithOnly } from './overview.aggregate'
import { OverviewAggregator } from './overview.aggregator'

@Injectable()
export class OverviewProvider {
  private readonly logger = new Logger(OverviewProvider.name)

  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(private readonly executorFactory: AggregateExecutorFactory) {}

  async aggregate<T extends Overview, K extends keyof T>({
    aggregator,
    mode,
    cycleIsActive,
    include,
  }: Filters<T, K> & { aggregator: OverviewAggregator }): Promise<OverviewWithOnly<K, T>> {
    const executor = this.executorFactory.newInstance<Overview>()

    const params: KeyResultLatestCheckInSegmentParams = {
      keyResult: {
        mode,
        objective: {
          cycle: {
            isActive: cycleIsActive,
          },
        },
      },
    }

    const included = (key: keyof T) => (include as Array<keyof T>)?.includes(key)

    // TODO: if (include?.allSubteams)
    // TODO: if (include?.directSubteams)

    if (included('objectives')) {
      const objectiveCountKey = aggregator.countObjectives(params.keyResult.objective)

      executor.number(objectiveCountKey, (objectiveCount) => {
        this.logger.log(`Extracted key ${objectiveCountKey} = %o`, objectiveCount)
        return {
          objectives: objectiveCount,
        }
      })
    }

    if (included('keyResults')) {
      const keyResultCountKey = aggregator.countKeyResults(params.keyResult)

      executor.number(keyResultCountKey, (keyResultCount) => {
        this.logger.log(`Extracted key ${keyResultCountKey} = %o`, keyResultCount)
        return {
          keyResults: keyResultCount,
        }
      })
    }

    if (included('mode')) {
      const modeCountKey = aggregator.countKeyResultsByMode(params.keyResult)

      executor.addExtractor<Record<KeyResultMode, number>>(modeCountKey, (modes) => {
        this.logger.log(`Extracted modes from results using key ${modeCountKey} = %o`, modes)

        return {
          mode: {
            [KeyResultMode.COMPLETED]: modes[KeyResultMode.COMPLETED] ?? 0,
            [KeyResultMode.DELETED]: modes[KeyResultMode.DELETED] ?? 0,
            [KeyResultMode.DRAFT]: modes[KeyResultMode.DRAFT] ?? 0,
            [KeyResultMode.PUBLISHED]: modes[KeyResultMode.PUBLISHED] ?? 0,
          },
        }
      })
    }

    if (included('confidence')) {
      const confidenceCountKey = aggregator.countKeyResultsByConfidence(params)

      executor.addExtractor<Partial<Record<number, number>>>(confidenceCountKey, (confidences) => {
        this.logger.log(`Extracted confidences from results using key ${confidenceCountKey} = %o`, confidences)

        const achievedKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.ACHIEVED)
        const highKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.HIGH)
        const mediumKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.MEDIUM)
        const lowKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.LOW)
        const barrierKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.BARRIER)
        const deprioritizedKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.DEPRIORITIZED)

        return {
          confidence: {
            [ConfidenceTag.ACHIEVED]: confidences?.[achievedKey] ?? 0,
            [ConfidenceTag.HIGH]: confidences?.[highKey] ?? 0,
            [ConfidenceTag.MEDIUM]: confidences?.[mediumKey] ?? 0,
            [ConfidenceTag.LOW]: confidences?.[lowKey] ?? 0,
            [ConfidenceTag.BARRIER]: confidences?.[barrierKey] ?? 0,
            [ConfidenceTag.DEPRIORITIZED]: confidences?.[deprioritizedKey] ?? 0,
          },
        }
      })
    }

    // TODO: if (included(accountability))

    return executor.execute(aggregator.getQuery())
  }
}
