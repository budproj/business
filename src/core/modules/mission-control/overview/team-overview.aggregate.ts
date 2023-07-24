import {
  Overview,
  OverviewWithAccountability,
  OverviewWithAllSubteams,
  OverviewWithConfidence,
  OverviewWithDirectSubteams,
  OverviewWithKeyResults,
  OverviewWithMode,
  OverviewWithObjectives,
} from './overview.aggregate'

export type TeamOverview = Pick<
  Overview,
  'allSubteams' | 'directSubteams' | 'objectives' | 'keyResults' | 'mode' | 'confidence' | 'accountability'
>

export type TeamOverviewWithAllSubteams = OverviewWithAllSubteams<TeamOverview>
export type TeamOverviewWithDirectSubteams = OverviewWithDirectSubteams<TeamOverview>
export type TeamOverviewWithObjectives = OverviewWithObjectives<TeamOverview>
export type TeamOverviewWithKeyResults = OverviewWithKeyResults<TeamOverview>
export type TeamOverviewWithMode = OverviewWithMode<TeamOverview>
export type TeamOverviewWithConfidence = OverviewWithConfidence<TeamOverview>
export type TeamOverviewWithAccountability = OverviewWithAccountability<TeamOverview>
