import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { SourceSegmentFactory } from '@core/modules/workspace/source-segment.factory'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { Filters } from '../status.aggregate'
import { StatusAggregator } from '../status.aggregator'
import { StatusProvider } from '../status.provider'

import { CycleStatus, CycleStatusWithOnly } from './cycle-status.aggregate'

type RootFilter = { cycleId: string }

@Injectable()
export class CycleStatusProvider {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly sourceSegmentFactory: SourceSegmentFactory,
    private readonly statusProvider: StatusProvider,
  ) {}

  @Stopwatch()
  async fromRoot<K extends keyof CycleStatus>({
    cycleId,
    ...filters
  }: RootFilter & Omit<Filters<CycleStatus, K>, 'okrType'>): Promise<CycleStatusWithOnly<K>> {
    const source = this.sourceSegmentFactory.fromCycles([cycleId])

    const aggregator = new StatusAggregator(source)

    return this.statusProvider.aggregate({
      ...filters,
      okrType: 'shared',
      aggregator,
    })
  }
}
