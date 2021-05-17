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

export const DEFAULT_CONFIDENCE = 100

export const CONFIDENCE_TAG_COLORS = {
  [ConfidenceTag.HIGH]: '#24CB8D',
  [ConfidenceTag.MEDIUM]: '#FFD964',
  [ConfidenceTag.LOW]: '#FF616A',
  [ConfidenceTag.BARRIER]: '#C26EFF',
}