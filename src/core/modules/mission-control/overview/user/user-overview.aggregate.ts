import {
  Overview,
  OverviewWithAccountability,
  OverviewWithAllSubteams,
  OverviewWithConfidence,
  OverviewWithDirectSubteams,
  OverviewWithKeyResults,
  OverviewWithMode,
  OverviewWithObjectives,
} from '../overview.aggregate'

export type UserOverview = Pick<Overview, 'objectives' | 'keyResults' | 'mode' | 'confidence' | 'accountability'> & {
  subjectEntity: 'user'
}

export type UserOverviewWithAllSubteams = OverviewWithAllSubteams<UserOverview>
export type UserOverviewWithDirectSubteams = OverviewWithDirectSubteams<UserOverview>
export type UserOverviewWithObjectives = OverviewWithObjectives<UserOverview>
export type UserOverviewWithKeyResults = OverviewWithKeyResults<UserOverview>
export type UserOverviewWithMode = OverviewWithMode<UserOverview>
export type UserOverviewWithConfidence = OverviewWithConfidence<UserOverview>
export type UserOverviewWithAccountability = OverviewWithAccountability<UserOverview>
