import { CONFIDENCE_TAG_ASC_ORDER, CONFIDENCE_TAG_THRESHOLDS } from './confidence-tag.constants'
import { ConfidenceTag } from './confidence-tag.enum'

export class ConfidenceTagAdapter {
  public differenceInConfidenceTagIndexes(
    previousConfidence: number,
    nextConfidence: number,
  ): number {
    const previousConfidenceIndex = this.getConfigdenceTagIndexFromConfidence(previousConfidence)
    const nextConfidenceIndex = this.getConfigdenceTagIndexFromConfidence(nextConfidence)

    return nextConfidenceIndex - previousConfidenceIndex
  }

  private getConfigdenceTagIndexFromConfidence(confidence: number): number {
    const confidenceTag = this.getConfidenceTag(confidence)

    return CONFIDENCE_TAG_ASC_ORDER.indexOf(confidenceTag)
  }

  private getConfidenceTag(confidence: number): ConfidenceTag {
    return CONFIDENCE_TAG_ASC_ORDER.find(
      (confidenceTag) => CONFIDENCE_TAG_THRESHOLDS[confidenceTag] >= confidence,
    )
  }
}
