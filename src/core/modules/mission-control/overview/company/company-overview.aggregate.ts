import { WithOnly } from '@core/modules/workspace/aggregate-executor'

import { Overview } from '../overview.aggregate'

export type CompanyOverview = Pick<
  Overview,
  'allSubteams' | 'directSubteams' | 'objectives' | 'keyResults' | 'mode' | 'confidence' | 'accountability'
>

export type CompanyOverviewWithOnly<K extends keyof CompanyOverview> = WithOnly<CompanyOverview, K>
