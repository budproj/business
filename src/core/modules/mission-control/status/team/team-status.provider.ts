import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'
import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { SourceSegmentFactory } from '@core/modules/workspace/source-segment.factory'
import { TeamScopeFactory } from '@core/modules/workspace/team-scope.factory'

import { Filters } from '../status.aggregate'
import { StatusAggregator } from '../status.aggregator'
import { StatusProvider } from '../status.provider'

import { TeamStatus, TeamStatusWithOnly } from './team-status.aggregate'

type RootFilter = { teamId: string }

@Injectable()
export class TeamStatusProvider {
  private readonly teamScopeFactory = new TeamScopeFactory()

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly statusProvider: StatusProvider,
    private readonly sourceSegmentFactory: SourceSegmentFactory,
  ) {}

  async fromRoot<K extends keyof TeamStatus>(
    filters: RootFilter & Omit<Filters<TeamStatus, K>, 'okrType'>,
  ): Promise<TeamStatusWithOnly<K>> {
    const teamScope = this.teamScopeFactory.descendingFromTeams({
      parentTeamIds: [filters.teamId],
      includeParentTeams: true,
    })

    const source = this.sourceSegmentFactory.fromTeamScope(teamScope)

    const aggregator = new StatusAggregator(source)

    return this.statusProvider.aggregate({
      ...filters,
      okrType: 'shared',
      aggregator,
    })
  }
}
