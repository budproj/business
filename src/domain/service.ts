import { uniq } from 'lodash'

import { CompanyDTO } from './company/dto'
import { TeamDTO } from './team/dto'
import { UserDTO } from './user/dto'

abstract class DomainService {
  async parseUserCompanies(user: UserDTO): Promise<Array<CompanyDTO['id']>> {
    const userTeams = await user.teams
    const userCompanies = uniq(userTeams.map((team) => team.companyId))

    return userCompanies
  }

  async parseUserTeams(user: UserDTO): Promise<Array<TeamDTO['id']>> {
    const userTeams = await user.teams
    const userTeamIDs = uniq(userTeams.map((team) => team.id))

    return userTeamIDs
  }
}

export default DomainService
