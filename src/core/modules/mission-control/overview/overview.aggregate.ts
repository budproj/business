import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'

export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property]
}

export type ModeOverview = Record<KeyResultMode, number>

export type ConfidenceOverview = Record<ConfidenceTag, number>

export type AccountabilityOverview = {
  unassigned: number
  lateCheckIn: number
}

// prettier-ignore
// export type SubjectEntity = 'company' | 'team' | 'cycle' | 'user' | 'objective'

export type Overview = {
  allSubteams?: number
  directSubteams?: number
  objectives?: number
  keyResults?: number
  mode?: ModeOverview
  confidence?: ConfidenceOverview
  accountability?: AccountabilityOverview
}

export type OverviewIncludeFilter = Partial<Record<keyof Overview, boolean>>

/**
 * TODO: move somewhere else
 * TODO: add indexes
 */
export type Filters = {
  // prettier-ignore
  // subjectId: string
  // subjectEntity: SubjectEntity
  createdAfter?: Date
  createdBefore?: Date
  mode?: KeyResultMode[]
  // TODO: add support for ObjectiveMode as well
  cycleIsActive?: boolean
  include: OverviewIncludeFilter
}

export type OverviewWithDirectSubteams<T extends Overview> = WithRequiredProperty<T, 'directSubteams'>

export type FiltersIncludeAllSubteams = Filters & {
  include: OverviewIncludeFilter & { allSubteams: true }
}

export type OverviewWithObjectives<T extends Overview> = WithRequiredProperty<T, 'objectives'>

export type FiltersIncludeDirectSubteams = Filters & {
  include: OverviewIncludeFilter & { directSubteams: true }
}

export type FiltersIncludeObjectives = Filters & {
  include: OverviewIncludeFilter & { objectives: true }
}

export type OverviewWithAllSubteams<T extends Overview> = WithRequiredProperty<T, 'allSubteams'>

export type FiltersIncludeKeyResults = Filters & {
  include: OverviewIncludeFilter & { keyResults: true }
}

export type OverviewWithKeyResults<T extends Overview> = WithRequiredProperty<T, 'keyResults'>

export type FiltersIncludeMode = Filters & {
  include: OverviewIncludeFilter & { mode: true }
}

export type OverviewWithMode<T extends Overview> = WithRequiredProperty<T, 'mode'>

export type FiltersIncludeConfidence = Filters & {
  include: OverviewIncludeFilter & { confidence: true }
}

export type OverviewWithConfidence<T extends Overview> = WithRequiredProperty<T, 'confidence'>

export type FiltersIncludeAccountability = Filters & {
  include: OverviewIncludeFilter & { accountability: true }
}

export type OverviewWithAccountability<T extends Overview> = WithRequiredProperty<T, 'accountability'>
