import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { SourceSegmentFactory } from '@core/modules/workspace/source-segment.factory'
import { TeamScopeFactory } from '@core/modules/workspace/team-scope.factory'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { Filters } from '../overview.aggregate'
import { OverviewAggregator } from '../overview.aggregator'
import { OverviewProvider } from '../overview.provider'

import { CompanyOverview, CompanyOverviewWithOnly } from './company-overview.aggregate'

type RootFilter = { companyId: string }
type TeamsFilter = { teamIds: string[] }

@Injectable()
export class CompanyOverviewProvider {
  private readonly teamScopeFactory = new TeamScopeFactory()

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly overviewProvider: OverviewProvider,
    private readonly sourceSegmentFactory: SourceSegmentFactory,
  ) {}

  @Stopwatch()
  async fromRoot<K extends keyof CompanyOverview>(
    filters: RootFilter & Filters<CompanyOverview, K>,
  ): Promise<CompanyOverviewWithOnly<K>> {
    const teamScope = this.teamScopeFactory.descendingDistinct({
      parentTeamIds: [filters.companyId],
      includeParentTeams: true,
    })

    const source = this.sourceSegmentFactory.fromTeamScope(teamScope)

    const aggregator = new OverviewAggregator(source)

    return this.overviewProvider.aggregate({ ...filters, aggregator })
  }

  @Stopwatch()
  async fromTeams<K extends keyof CompanyOverview>(
    filters: TeamsFilter & Filters<CompanyOverview, K>,
  ): Promise<CompanyOverviewWithOnly<K>> {
    const teamScope = this.teamScopeFactory.bidirectional({
      originTeamIds: filters.teamIds,
    })

    const source = this.sourceSegmentFactory.fromTeamScope(teamScope)

    const aggregator = new OverviewAggregator(source)

    return this.overviewProvider.aggregate<CompanyOverview, K>({ ...filters, aggregator })
  }
}
