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

export type CompanyOverview = Pick<
  Overview,
  'allSubteams' | 'directSubteams' | 'objectives' | 'keyResults' | 'mode' | 'confidence' | 'accountability'
>

export type CompanyOverviewWithAllSubteams = OverviewWithAllSubteams<CompanyOverview>
export type CompanyOverviewWithDirectSubteams = OverviewWithDirectSubteams<CompanyOverview>
export type CompanyOverviewWithObjectives = OverviewWithObjectives<CompanyOverview>
export type CompanyOverviewWithKeyResults = OverviewWithKeyResults<CompanyOverview>
export type CompanyOverviewWithMode = OverviewWithMode<CompanyOverview>
export type CompanyOverviewWithConfidence = OverviewWithConfidence<CompanyOverview>
export type CompanyOverviewWithAccountability = OverviewWithAccountability<CompanyOverview>
