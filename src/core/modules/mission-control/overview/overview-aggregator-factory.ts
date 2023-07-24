import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator'

import { TeamTreeQueries } from '@core/modules/team/team-tree-queries.provider'

import { OverviewAggregator } from './overview.aggregator'

@Injectable()
export class OverviewAggregatorFactory {
  constructor(private readonly teamTreeQueries: TeamTreeQueries) {}

  withinCompany(companyId: string) {
    const [teamIdsSource, teamIdsQuery, teamIdsParams] = this.teamTreeQueries.descendingDistinct({
      parentTeamIds: [companyId],
      includeParentTeams: true,
    })

    return new OverviewAggregator({
      name: teamIdsSource,
      cte: teamIdsQuery,
      params: teamIdsParams,
      require: [],
    })
  }

  withinCompanyFromTeams(teamIds: string[]) {
    const [teamIdsSource, teamIdsQuery, teamIdsParams] = this.teamTreeQueries.bidirectionalQuery({
      originTeamIds: teamIds,
    })

    return new OverviewAggregator({
      name: teamIdsSource,
      cte: teamIdsQuery,
      params: teamIdsParams,
      require: [],
    })
  }

  // TODO: withinCompanyFromUser
  // TODO: withinTeam
  // TODO: withinTeamFromUser
  // TODO: withinCycle
  // TODO: withinUser
  // TODO: withinObjective
}
