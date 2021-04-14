import { differenceInDays } from 'date-fns'

import { CoreEntitySpecification } from '@core/core.specification'

import { KeyResult } from '../key-result.orm-entity'

export class IsOutdated extends CoreEntitySpecification<KeyResult> {
  currentRevision = this.rev20210316LastCheckInWas7DaysAgoOrMore

  public isSatisfiedBy(keyResult: KeyResult) {
    return this.currentRevision(keyResult)
  }

  private rev20210316LastCheckInWas7DaysAgoOrMore(keyResult: KeyResult) {
    const anchorDateValue = keyResult?.checkIns?.[0].createdAt ?? keyResult.createdAt
    const anchorDate = new Date(anchorDateValue)
    const currentDate = new Date()
    const daysDifference = differenceInDays(currentDate, anchorDate)

    return daysDifference > 7
  }
}
