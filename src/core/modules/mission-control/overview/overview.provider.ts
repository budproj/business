import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { AggregateExecutorFactory } from '@core/modules/workspace/aggregate-executor.factory'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { CompanyOverview } from './company/company-overview.aggregate'
import { Filters, Overview } from './overview.aggregate'
import { OverviewAggregator } from './overview.aggregator'

type FromAggregator = { aggregator: OverviewAggregator }

@Injectable()
export class OverviewProvider {
  private readonly logger = new Logger(OverviewProvider.name)

  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(private readonly executorFactory: AggregateExecutorFactory) {}

  // prettier-ignore
  // async aggregate(filters: FromAggregator & FiltersIncludeAllSubteams): Promise<CompanyOverviewWithAllSubteams>
  // async aggregate(filters: FromAggregator & FiltersIncludeDirectSubteams): Promise<CompanyOverviewWithDirectSubteams>
  // async aggregate(filters: FromAggregator & FiltersIncludeObjectives): Promise<CompanyOverviewWithObjectives>
  // async aggregate(filters: FromAggregator & FiltersIncludeKeyResults): Promise<CompanyOverviewWithKeyResults>
  // async aggregate(filters: FromAggregator & FiltersIncludeMode): Promise<CompanyOverviewWithMode>
  // async aggregate(filters: FromAggregator & FiltersIncludeConfidence): Promise<CompanyOverviewWithConfidence>
  // async aggregate(filters: FromAggregator & FiltersIncludeAccountability): Promise<CompanyOverviewWithAccountability>

  // TODO: refactor method into smaller ones
  @Stopwatch()
  async aggregate({
    aggregator,
    createdAfter,
    createdBefore,
    mode,
    cycleIsActive,
    include,
  }: FromAggregator & Filters): Promise<Overview> {
    const executor = this.executorFactory.newInstance<CompanyOverview>()

    // TODO: filter by createdAfter
    // TODO: filter by createdBefore
    // TODO: filter by mode

    // TODO: if (include?.allSubteams)
    // TODO: if (include?.directSubteams)

    if (include?.objectives) {
      const objectiveCountKey = aggregator.countObjectives({ cycleIsActive })

      executor.addExtractor<number>(objectiveCountKey, (objectiveCount) => {
        this.logger.log(`Extracting key ${objectiveCountKey} =`, objectiveCount)
        return {
          objectives: objectiveCount,
        }
      })
    }

    if (include?.keyResults) {
      const keyResultCountKey = aggregator.countKeyResults({ cycleIsActive, mode })

      executor.addExtractor<number>(keyResultCountKey, (keyResultCount) => {
        this.logger.log(`Extracted key ${keyResultCountKey} =`, keyResultCount)
        return {
          keyResults: keyResultCount,
        }
      })
    }

    if (include?.mode) {
      const modeCountKey = aggregator.countKeyResultsByMode({ cycleIsActive, mode })

      executor.addExtractor<Record<KeyResultMode, number>>(modeCountKey,modes => {
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

    if (include?.confidence) {
      const confidenceCountKey = aggregator.countKeyResultsByConfidence({ cycleIsActive, mode })

      executor.addExtractor<Partial<Record<number, number>>>(confidenceCountKey, (confidences) => {
        this.logger.log(`Extracted confidences from results using key ${confidenceCountKey} = %o`, confidences)

        // TODO: ACHIEVED
        const highKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.HIGH)
        const mediumKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.MEDIUM)
        const lowKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.LOW)
        const barrierKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.BARRIER)
        // TODO: DEPRIORITIZED

        return {
          confidence: {
            // TODO: ACHIEVED
            [ConfidenceTag.HIGH]: confidences?.[highKey] ?? 0,
            [ConfidenceTag.MEDIUM]: confidences?.[mediumKey] ?? 0,
            [ConfidenceTag.LOW]: confidences?.[lowKey] ?? 0,
            [ConfidenceTag.BARRIER]: confidences?.[barrierKey] ?? 0,
            // TODO: DEPRIORITIZED
          },
        }
      })
    }

    // TODO: if (include?.accountability)

    return executor.execute(aggregator.getQuery())
  }
}
