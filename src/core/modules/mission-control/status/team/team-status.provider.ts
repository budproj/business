import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { TeamScopeFactory } from '@core/modules/workspace/team-scope.factory'

import { Filters } from '../status.aggregate'
import { StatusAggregator } from '../status.aggregator'
import { StatusProvider } from '../status.provider'

import { TeamStatus, TeamStatusWithOnly } from './team-status.aggregate'

type RootFilter = { teamId: string }

@Injectable()
export class TeamStatusProvider {
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly statusProvider: StatusProvider,
    private readonly teamScopeFactory: TeamScopeFactory,
  ) {}

  async fromRoot<K extends keyof TeamStatus>(
    filters: RootFilter & Filters<TeamStatus, K>,
  ): Promise<TeamStatusWithOnly<K>> {
    const [teamIdsSource, teamIdsQuery, teamIdsParams] = this.teamScopeFactory.descendingDistinct({
      parentTeamIds: [filters.teamId],
      includeParentTeams: true,
    })

    const aggregator = new StatusAggregator({
      name: teamIdsSource,
      cte: teamIdsQuery,
      params: teamIdsParams,
      require: [],
    })

    return this.statusProvider.aggregate({ ...filters, aggregator })
  }
}
