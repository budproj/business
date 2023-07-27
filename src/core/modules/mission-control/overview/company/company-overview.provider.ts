import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { OverviewAggregator } from '@core/modules/mission-control/overview/overview.aggregator'
import { TeamScopeFactory } from '@core/modules/workspace/team-scope.factory'

import {
  CompanyOverview,
  CompanyOverviewWithAccountability,
  CompanyOverviewWithAllSubteams,
  CompanyOverviewWithConfidence,
  CompanyOverviewWithDirectSubteams,
  CompanyOverviewWithKeyResults,
  CompanyOverviewWithMode,
  CompanyOverviewWithObjectives,
} from './company-overview.aggregate'
import {
  Filters,
  FiltersIncludeAccountability,
  FiltersIncludeAllSubteams,
  FiltersIncludeConfidence,
  FiltersIncludeDirectSubteams,
  FiltersIncludeKeyResults,
  FiltersIncludeMode,
  FiltersIncludeObjectives,
} from '../overview.aggregate'
import { OverviewProvider } from '../overview.provider'

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

  async fromRoot(filters: RootFilter & FiltersIncludeAllSubteams): Promise<CompanyOverviewWithAllSubteams>
  async fromRoot(filters: RootFilter & FiltersIncludeDirectSubteams): Promise<CompanyOverviewWithDirectSubteams>
  async fromRoot(filters: RootFilter & FiltersIncludeObjectives): Promise<CompanyOverviewWithObjectives>
  async fromRoot(filters: RootFilter & FiltersIncludeKeyResults): Promise<CompanyOverviewWithKeyResults>
  async fromRoot(filters: RootFilter & FiltersIncludeMode): Promise<CompanyOverviewWithMode>
  async fromRoot(filters: RootFilter & FiltersIncludeConfidence): Promise<CompanyOverviewWithConfidence>
  async fromRoot(filters: RootFilter & FiltersIncludeAccountability): Promise<CompanyOverviewWithAccountability>

  async fromRoot(filters: RootFilter & Filters): Promise<CompanyOverview> {
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

  async fromTeams(filters: TeamsFilter & FiltersIncludeAllSubteams): Promise<CompanyOverviewWithAllSubteams>
  async fromTeams(filters: TeamsFilter & FiltersIncludeDirectSubteams): Promise<CompanyOverviewWithDirectSubteams>
  async fromTeams(filters: TeamsFilter & FiltersIncludeObjectives): Promise<CompanyOverviewWithObjectives>
  async fromTeams(filters: TeamsFilter & FiltersIncludeKeyResults): Promise<CompanyOverviewWithKeyResults>
  async fromTeams(filters: TeamsFilter & FiltersIncludeMode): Promise<CompanyOverviewWithMode>
  async fromTeams(filters: TeamsFilter & FiltersIncludeConfidence): Promise<CompanyOverviewWithConfidence>
  async fromTeams(filters: TeamsFilter & FiltersIncludeAccountability): Promise<CompanyOverviewWithAccountability>

  async fromTeams(filters: TeamsFilter & Filters): Promise<CompanyOverview> {
    const [teamIdsSource, teamIdsQuery, teamIdsParams] = this.teamScopeFactory.bidirectional({
      originTeamIds: filters.teamIds,
    })

    const aggregator = new OverviewAggregator({
      name: teamIdsSource,
      cte: teamIdsQuery,
      params: teamIdsParams,
      require: [],
    })

    return this.overviewProvider.aggregate({ ...filters, aggregator })
  }

  // TODO: withinCompanyFromUser
  // TODO: withinTeam
  // TODO: withinTeamFromUser
  // TODO: withinCycle
  // TODO: withinUser
  // TODO: withinObjective
}
