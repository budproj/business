import { AggregateFactory } from '@core/modules/workspace/aggregate.factory'
import { SegmentFactory } from '@core/modules/workspace/segment.factory'
import { AggregationQuery, Segment } from '@core/modules/workspace/workspace.interface'

export class OverviewAggregator {
  private readonly segmentFactory: SegmentFactory

  private readonly aggregateFactory: AggregateFactory

  constructor(source: Segment) {
    this.segmentFactory = new SegmentFactory(source)
    this.aggregateFactory = new AggregateFactory(source)
  }

  countObjectives(...params: Parameters<SegmentFactory['objectives']>): string {
    const segment = this.segmentFactory.objectives(...params)

    return this.aggregateFactory.count(segment)
  }

  countObjectivesByMode(...params: Parameters<SegmentFactory['objectives']>): string {
    const segment = this.segmentFactory.objectives(...params)

    return this.aggregateFactory.countGroupBy(segment, 'mode')
  }

  countKeyResults(...params: Parameters<SegmentFactory['keyResults']>): string {
    const segment = this.segmentFactory.keyResults(...params)

    return this.aggregateFactory.count(segment)
  }

  countKeyResultsByMode(...params: Parameters<SegmentFactory['keyResults']>): string {
    const segment = this.segmentFactory.keyResults(...params)

    return this.aggregateFactory.countGroupBy(segment, 'mode')
  }

  countKeyResultsByConfidence(...params: Parameters<SegmentFactory['keyResultLatestCheckIns']>): string {
    const latestStatusSegment = this.segmentFactory.keyResultLatestStatus(...params)

    const groupBy = 'confidence'

    const name = `count_${latestStatusSegment.name}_group_by_${groupBy}`

    const dataColumn = 'json_object_agg(subkey, count)'

    const source = `
      (
          SELECT krs.confidence,
                 count(*)
          FROM "${latestStatusSegment.name}" krs
          GROUP BY 1
      ) AS confidence_count(subkey, count)
    `

    this.aggregateFactory.addAggregate({
      name,
      dataColumn,
      source,
      params: {},
      require: [latestStatusSegment],
    })

    return name
  }

  getQuery(): AggregationQuery {
    return this.aggregateFactory.getQuery()
  }
}
