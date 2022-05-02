import {
  CONFIDENCE_TAG_ASC_ORDER,
  CONFIDENCE_TAG_BACKGROUND_COLORS,
  CONFIDENCE_TAG_PRIMARY_COLORS,
  CONFIDENCE_TAG_THRESHOLDS,
  DEFAULT_CONFIDENCE,
} from './confidence-tag.constants'
import { ConfidenceTag } from './confidence-tag.enum'

export class ConfidenceTagAdapter {
  public differenceInConfidenceTagIndexes(
    previousConfidence: number,
    nextConfidence: number,
  ): number {
    const previousConfidenceIndex = this.getConfidenceTagIndexFromConfidence(previousConfidence)
    const nextConfidenceIndex = this.getConfidenceTagIndexFromConfidence(nextConfidence)

    return nextConfidenceIndex - previousConfidenceIndex
  }

  public getPrimaryColorFromConfidence(confidence: number = DEFAULT_CONFIDENCE): string {
    const confidenceTag = this.getTagForConfidence(confidence)

    return CONFIDENCE_TAG_PRIMARY_COLORS[confidenceTag]
  }

  public getBackgroundColorFromConfidence(confidence: number = DEFAULT_CONFIDENCE): string {
    const confidenceTag = this.getTagForConfidence(confidence)

    return CONFIDENCE_TAG_BACKGROUND_COLORS[confidenceTag]
  }

  public getConfidenceFromTag(confidence: ConfidenceTag): number {
    return CONFIDENCE_TAG_THRESHOLDS[confidence]
  }

  private getConfidenceTagIndexFromConfidence(confidence: number): number {
    const confidenceTag = this.getTagForConfidence(confidence)

    return CONFIDENCE_TAG_ASC_ORDER.indexOf(confidenceTag)
  }

  private getTagForConfidence(confidence: number): ConfidenceTag {
    return CONFIDENCE_TAG_ASC_ORDER.find(
      (confidenceTag) => CONFIDENCE_TAG_THRESHOLDS[confidenceTag] >= confidence,
    )
  }
}
