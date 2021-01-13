import DomainSpecification from 'src/domain/specification'
import { TeamDTO } from 'src/domain/team/dto'

class IsACompany extends DomainSpecification<TeamDTO> {
  currentRevision = this.rev20210102DoNotHaveParentTeam

  isSatisfiedBy(team: TeamDTO) {
    return this.currentRevision(team)
  }

  rev20210102DoNotHaveParentTeam(team: TeamDTO) {
    return team.parentTeamId === null
  }
}

export default IsACompany
