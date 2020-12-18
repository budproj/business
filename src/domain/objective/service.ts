import { Injectable } from '@nestjs/common'
import { Any } from 'typeorm'

import { CycleDTO } from 'domain/cycle/dto'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainKeyResultService from 'domain/key-result/service'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

@Injectable()
class DomainObjectiveService extends DomainEntityService<Objective, ObjectiveDTO> {
  constructor(
    public readonly repository: DomainObjectiveRepository,
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainObjectiveService.name)
  }

  async getFromCycle(cycleId: CycleDTO['id']): Promise<Objective[]> {
    return this.repository.find({ cycleId })
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Objective[]> {
    return this.repository.find({ ownerId })
  }

  async getCurrentProgress(objectiveId: ObjectiveDTO['id']): Promise<ProgressReport['valueNew']> {
    const keyResults = await this.keyResultService.getFromObjective(objectiveId)
    if (!keyResults) return

    const objectiveCurrentProgress = this.keyResultService.calculateCurrentProgressFromList(
      keyResults,
    )

    return objectiveCurrentProgress
  }

  async getCurrentConfidence(objectiveId: ObjectiveDTO['id']): Promise<ProgressReport['valueNew']> {
    const keyResults = await this.keyResultService.getFromObjective(objectiveId)
    if (!keyResults) return

    const objectiveCurrentConfidence = this.keyResultService.calculateCurrentConfidenceFromList(
      keyResults,
    )

    return objectiveCurrentConfidence
  }

  async getFromTeam(teamId: TeamDTO['id']) {
    const keyResults = await this.keyResultService.getFromTeam(teamId, ['objectiveId'])
    if (!keyResults) return []

    const objectiveIds = keyResults.map((keyResult) => keyResult.objectiveId)
    if (objectiveIds.length === 0) return []

    const objectives = await this.repository.find({ where: { id: Any(objectiveIds) } })

    return objectives
  }
}

export default DomainObjectiveService
