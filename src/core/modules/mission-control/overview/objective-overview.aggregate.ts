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

export type ObjectiveOverview = Pick<Overview, 'keyResults' | 'mode' | 'confidence' | 'accountability'> & {
  subjectEntity: 'objective'
}

export type ObjectiveOverviewWithAllSubteams = OverviewWithAllSubteams<ObjectiveOverview>
export type ObjectiveOverviewWithDirectSubteams = OverviewWithDirectSubteams<ObjectiveOverview>
export type ObjectiveOverviewWithObjectives = OverviewWithObjectives<ObjectiveOverview>
export type ObjectiveOverviewWithKeyResults = OverviewWithKeyResults<ObjectiveOverview>
export type ObjectiveOverviewWithMode = OverviewWithMode<ObjectiveOverview>
export type ObjectiveOverviewWithConfidence = OverviewWithConfidence<ObjectiveOverview>
export type ObjectiveOverviewWithAccountability = OverviewWithAccountability<ObjectiveOverview>
