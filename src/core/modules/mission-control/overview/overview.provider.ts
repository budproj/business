import { Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { Connection } from 'typeorm'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { CompanyOverview } from './company-overview.aggregate'
import { Filters, Overview } from './overview.aggregate'
import { OverviewAggregator } from './overview.aggregator'

type OverviewAggregateResults = { results: Record<string, unknown> }

type OverviewResultExtractor = (results: Record<string, unknown>) => Partial<CompanyOverview>

type FromAggregator = { aggregator: OverviewAggregator }

@Injectable()
export class OverviewProvider {
  private readonly logger = new Logger(OverviewProvider.name)

  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(private readonly connection: Connection) {}

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
    const extractors: OverviewResultExtractor[] = []

    // TODO: filter by createdAfter
    // TODO: filter by createdBefore
    // TODO: filter by mode

    // TODO: if (include?.allSubteams)
    // TODO: if (include?.directSubteams)

    if (include?.objectives) {
      const objectiveCountKey = aggregator.countObjectives({ cycleIsActive })

      extractors.push((results) => {
        this.logger.log(`Extracting key ${objectiveCountKey} from results %o`, results)
        return {
          objectives: Number(results[objectiveCountKey]),
        }
      })
    }

    if (include?.keyResults) {
      const keyResultCountKey = aggregator.countKeyResults({ cycleIsActive, mode })

      extractors.push((results) => {
        this.logger.log(`Extracting key ${keyResultCountKey} from results %o`, results)
        return {
          keyResults: Number(results[keyResultCountKey]),
        }
      })
    }

    if (include?.mode) {
      const modeCountKey = aggregator.countKeyResultsByMode({ cycleIsActive, mode })

      extractors.push((results) => {
        const modes = results[modeCountKey] as Partial<Record<KeyResultMode, number>>

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

      extractors.push((results) => {
        const confidences = results[confidenceCountKey] as Partial<Record<number, number>>

        this.logger.log(`Extracted confidences from results using key ${confidenceCountKey} = %o`, confidences)

        const highKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.HIGH)
        const mediumKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.MEDIUM)
        const lowKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.LOW)
        const barrierKey = this.confidenceTagAdapter.getConfidenceFromTag(ConfidenceTag.BARRIER)

        return {
          confidence: {
            [ConfidenceTag.HIGH]: confidences?.[highKey] ?? 0,
            [ConfidenceTag.MEDIUM]: confidences?.[mediumKey] ?? 0,
            [ConfidenceTag.LOW]: confidences?.[lowKey] ?? 0,
            [ConfidenceTag.BARRIER]: confidences?.[barrierKey] ?? 0,
          },
        }
      })
    }

    // TODO: if (include?.accountability)

    const [query, params] = aggregator.getRawQuery()

    // TODO: find a proper way to type these results
    const [{ results }]: [OverviewAggregateResults] = await this.connection.query(query, params)

    this.logger.log('Overview query results %o', results)

    // TODO: move this logic to a generic class
    return extractors.reduce(
      (overview, extractor) => ({
        ...overview,
        ...extractor(results),
      }),
      {},
    )
  }
}
