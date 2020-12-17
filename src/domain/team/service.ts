import { Injectable } from '@nestjs/common'
import { sum } from 'lodash'

import { CompanyDTO } from 'domain/company/dto'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'

@Injectable()
class DomainTeamService extends DomainEntityService<Team, TeamDTO> {
  constructor(
    public readonly repository: DomainTeamRepository,
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainTeamService.name)
  }

  async getFromCompany(companyId: CompanyDTO['id']): Promise<Team[]> {
    return this.repository.find({ companyId })
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Team[]> {
    return this.repository.find({ ownerId })
  }

  async getCurrentProgress(teamId: TeamDTO['id']): Promise<ProgressReport['valueNew']> {
    const childTeams = await this.repository.find({
      select: ['id'],
      where: { parentTeamId: teamId },
    })
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const currentProgressList = await Promise.all(
      keyResults.map(async ({ id }) => this.keyResultService.getCurrentProgress(id)),
    )
    const teamCurrentProgress = sum(currentProgressList) / currentProgressList.length

    return teamCurrentProgress
  }
}

export default DomainTeamService
