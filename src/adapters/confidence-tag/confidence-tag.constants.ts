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

export const CONFIDENCE_TAG_PRIMARY_COLORS = {
  [ConfidenceTag.HIGH]: '#24CB8D',
  [ConfidenceTag.MEDIUM]: '#F1BF25',
  [ConfidenceTag.LOW]: '#FF616A',
  [ConfidenceTag.BARRIER]: '#C26EFF',
}

export const CONFIDENCE_TAG_BACKGROUND_COLORS = {
  [ConfidenceTag.HIGH]: '#D3F5E8',
  [ConfidenceTag.MEDIUM]: '#FFF0C1',
  [ConfidenceTag.LOW]: '#FFDFE1',
  [ConfidenceTag.BARRIER]: '#F3E2FF',
}
