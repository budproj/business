import { differenceInDays } from 'date-fns'

import { DomainEntitySpecification } from 'src/domain/entity'
import { KeyResultDTO } from 'src/domain/key-result/dto'

class IsOutdated extends DomainEntitySpecification<KeyResultDTO> {
  currentRevision = this.rev20210316LastCheckInWas7DaysAgoAndCycleIsActive

  public isSatisfiedBy(keyResult: KeyResultDTO) {
    return this.currentRevision(keyResult)
  }

  private rev20210316LastCheckInWas7DaysAgoAndCycleIsActive(keyResult: KeyResultDTO) {
    if (!keyResult.objective.cycle.active) return true

    const anchorDateValue = keyResult?.checkIns?.[0].createdAt ?? keyResult.createdAt
    const anchorDate = new Date(anchorDateValue)
    const currentDate = new Date()
    const daysDifference = differenceInDays(currentDate, anchorDate)

    return daysDifference > 7
  }
}

export default IsOutdated
