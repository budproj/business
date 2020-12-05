import { Injectable } from '@nestjs/common'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { CycleDTO } from 'domain/cycle/dto'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

@Injectable()
class DomainObjectiveService extends DomainEntityService<Objective, ObjectiveDTO> {
  constructor(public readonly repository: DomainObjectiveRepository) {
    super(repository, DomainObjectiveService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<Objective>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const relatedCompanies = await this.repository.findRelatedCompanies(selector)
    const canUserRead = relatedCompanies.every((company) => userCompanies.includes(company.id))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<Objective>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const canUserRead = relatedTeams.every((team) => userTeams.includes(team.id))

    return canUserRead
  }

  async canUserReadForSelf(selector: FindConditions<Objective>, user: UserDTO): Promise<boolean> {
    const selectedObjectives = await this.repository.find(selector)
    const canUserRead = selectedObjectives.every((objective) => objective.ownerId === user.id)

    return canUserRead
  }

  async getFromCycle(cycleId: CycleDTO['id']): Promise<Objective[]> {
    return this.repository.find({ cycleId })
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Objective[]> {
    return this.repository.find({ ownerId })
  }
}

export default DomainObjectiveService
