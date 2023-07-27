import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { TeamScopeFactory } from '@core/modules/workspace/team-scope.factory'

import { Filters } from '../overview.aggregate'
import { OverviewAggregator } from '../overview.aggregator'
import { OverviewProvider } from '../overview.provider'

import { CompanyOverview, CompanyOverviewWithOnly } from './company-overview.aggregate'

type RootFilter = { companyId: string }
type TeamsFilter = { teamIds: string[] }

@Injectable()
export class CompanyOverviewProvider {
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly overviewProvider: OverviewProvider,
    private readonly teamScopeFactory: TeamScopeFactory,
  ) {}

  async fromRoot<K extends keyof CompanyOverview>(
    filters: RootFilter & Filters<CompanyOverview, K>,
  ): Promise<CompanyOverviewWithOnly<K>> {
    const [teamIdsSource, teamIdsQuery, teamIdsParams] = this.teamScopeFactory.descendingDistinct({
      parentTeamIds: [filters.companyId],
      includeParentTeams: true,
    })

    const aggregator = new OverviewAggregator({
      name: teamIdsSource,
      cte: teamIdsQuery,
      params: teamIdsParams,
      require: [],
    })

    return this.overviewProvider.aggregate({ ...filters, aggregator })
  }

  async fromTeams<K extends keyof CompanyOverview>(
    filters: TeamsFilter & Filters<CompanyOverview, K>,
  ): Promise<CompanyOverviewWithOnly<K>> {
    const [teamIdsSource, teamIdsQuery, teamIdsParams] = this.teamScopeFactory.bidirectional({
      originTeamIds: filters.teamIds,
    })

    const aggregator = new OverviewAggregator({
      name: teamIdsSource,
      cte: teamIdsQuery,
      params: teamIdsParams,
      require: [],
    })

    return this.overviewProvider.aggregate<CompanyOverview, K>({ ...filters, aggregator })
  }

  // TODO: withinCompanyFromUser
  // TODO: withinTeam
  // TODO: withinTeamFromUser
  // TODO: withinCycle
  // TODO: withinUser
  // TODO: withinObjective
}
