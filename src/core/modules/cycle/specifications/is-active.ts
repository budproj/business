import { CoreEntitySpecification } from '@core/core.specification'

import { CycleInterface } from '../cycle.interface'

export class IsActiveSpecification extends CoreEntitySpecification<CycleInterface> {
  currentRevision = this.rev20210412IsActiveParameterTrue

  public isSatisfiedBy(cycle: CycleInterface) {
    return this.currentRevision(cycle)
  }

  private rev20210412IsActiveParameterTrue(cycle: CycleInterface) {
    return cycle.active
  }
}
