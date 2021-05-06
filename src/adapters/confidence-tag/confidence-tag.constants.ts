import { ConfidenceTag } from './confidence-tag.enum'

export const CONFIDENCE_TAG_THRESHOLDS = {
  [ConfidenceTag.HIGH]: 100,
  [ConfidenceTag.MEDIUM]: 66,
  [ConfidenceTag.LOW]: 32,
  [ConfidenceTag.BARRIER]: -1,
}

export const CONFIDENCE_TAG_ASC_ORDER = [
  ConfidenceTag.BARRIER,
  ConfidenceTag.LOW,
  ConfidenceTag.MEDIUM,
  ConfidenceTag.HIGH,
]
