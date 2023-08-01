import { AggregateFactory } from '@core/modules/workspace/aggregate.factory'
import { SegmentFactory } from '@core/modules/workspace/segment.factory'
import { AggregationQuery, SourceSegment } from '@core/modules/workspace/workspace.interface'

export class StatusAggregator {
  private readonly segmentFactory: SegmentFactory

  private readonly aggregateFactory: AggregateFactory

  constructor(source: SourceSegment) {
    this.segmentFactory = new SegmentFactory(source)
    this.aggregateFactory = new AggregateFactory(source)
  }

  averageProgress(...params: Parameters<SegmentFactory['objectiveProgress']>): string {
    const segment = this.segmentFactory.objectiveProgress(...params)

    return this.aggregateFactory.average(segment, 'progress')
  }

  minConfidence(...params: Parameters<SegmentFactory['objectiveProgress']>): string {
    const segment = this.segmentFactory.objectiveProgress(...params)

    return this.aggregateFactory.min(segment, 'confidence')
  }

  latestCheckIn(...params: Parameters<SegmentFactory['keyResultLatestCheckIns']>): string {
    const segment = this.segmentFactory.keyResultLatestCheckIns(...params)

    const name = `${segment.name}_latest_check_in`

    const dataColumn = 'CASE WHEN value IS NOT NULL THEN to_json(latest_check_in) END'

    const source = `
      (
          SELECT krck.*, (u.first_name || ' ' || u.last_name) AS user_full_name
          FROM "${segment.name}" krck
          INNER JOIN "user" u ON u.id = krck.user_id
          ORDER BY krck.created_at DESC
          LIMIT 1
      ) AS latest_check_in
    `

    this.aggregateFactory.addAggregate({
      name,
      dataColumn,
      source,
      params: {},
      require: [segment],
    })

    return name
  }

  isActive(...params: Parameters<SegmentFactory['keyResults']>): string {
    const keyResultSegment = this.segmentFactory.keyResults(...params)
    const objectiveSegment = this.segmentFactory.objectives(params[0].objective)
    const cycleSegment = this.segmentFactory.cycles(params[0].objective.cycle)

    const name = `${keyResultSegment.name}_${cycleSegment.name}_is_active`

    const dataColumn = 'to_json(greatest(c.active, FALSE))'

    const source = `
      "${keyResultSegment.name}" kr
      LEFT JOIN "${objectiveSegment.name}" o ON o.id = kr.objective_id
      LEFT JOIN "${cycleSegment.name}" c ON c.id = o.cycle_id AND c.active IS TRUE
      LIMIT 1
    `

    this.aggregateFactory.addAggregate({
      name,
      dataColumn,
      source,
      params: {},
      require: [keyResultSegment, objectiveSegment, cycleSegment],
    })

    return name
  }

  isOutdated(...params: Parameters<SegmentFactory['keyResultLatestCheckIns']>): string {
    const keyResultSegment = this.segmentFactory.keyResults(params[0].keyResult)
    const latestCheckInSegment = this.segmentFactory.keyResultLatestCheckIns(...params)

    const name = `${latestCheckInSegment.name}_latest_check_in_is_outdated`

    const dataColumn = 'to_json(greatest(EXTRACT(DAY FROM now() - coalesce(last_check_in_date, now())) > 6, FALSE))'

    const source = `
      (
        SELECT coalesce(krck.created_at, kr.created_at)
        FROM "${keyResultSegment.name}" kr
        LEFT JOIN "${latestCheckInSegment.name}" krck ON krck.key_result_id = kr.id
        ORDER BY 1 DESC
        LIMIT 1
      ) AS latest_check_in (last_check_in_date)
    `

    this.aggregateFactory.addAggregate({
      name,
      dataColumn,
      source,
      params: {},
      require: [keyResultSegment, latestCheckInSegment],
    })

    return name
  }

  getQuery(): AggregationQuery {
    return this.aggregateFactory.getQuery()
  }
}
