import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { WithOnly } from '@core/modules/workspace/aggregate-executor'

export type ModeOverview = Record<KeyResultMode, number>

export type ConfidenceOverview = Record<ConfidenceTag, number>

export type AccountabilityOverview = {
  unassigned: number
  lateCheckIn: number
}

export type Overview = {
  allSubteams?: number
  directSubteams?: number
  objectives?: number
  keyResults?: number
  mode?: ModeOverview
  confidence?: ConfidenceOverview
  accountability?: AccountabilityOverview
}

export type OverviewWithOnly<K extends keyof T, T extends Overview = Overview> = WithOnly<T, K>

/**
 * TODO: add indexes
 */
export type Filters<T extends Overview = Overview, K extends keyof T = keyof T> = {
  // TODO: add support for date filters
  mode?: KeyResultMode[]
  // TODO: add support for ObjectiveMode as well
  cycleIsActive?: boolean
  include: K[]
}
