import { CoreEntitySpecification } from '@core/core.specification'

import { TeamInterface } from '../interfaces/team.interface'

export class IsACompanySpecification extends CoreEntitySpecification<TeamInterface> {
  currentRevision = this.rev20210102DoNotHaveParentTeam

  public isSatisfiedBy(team: TeamInterface) {
    return this.currentRevision(team)
  }

  private rev20210102DoNotHaveParentTeam(team: TeamInterface) {
    return team.parentId === null
  }
}
