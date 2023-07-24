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

export type CycleOverview = Pick<Overview, 'objectives' | 'keyResults' | 'mode' | 'confidence' | 'accountability'> & {
  subjectEntity: 'cycle'
}

export type CycleOverviewWithAllSubteams = OverviewWithAllSubteams<CycleOverview>
export type CycleOverviewWithDirectSubteams = OverviewWithDirectSubteams<CycleOverview>
export type CycleOverviewWithObjectives = OverviewWithObjectives<CycleOverview>
export type CycleOverviewWithKeyResults = OverviewWithKeyResults<CycleOverview>
export type CycleOverviewWithMode = OverviewWithMode<CycleOverview>
export type CycleOverviewWithConfidence = OverviewWithConfidence<CycleOverview>
export type CycleOverviewWithAccountability = OverviewWithAccountability<CycleOverview>
