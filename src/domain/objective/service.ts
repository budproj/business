import { Injectable } from '@nestjs/common'
import { Any } from 'typeorm'

import { CycleDTO } from 'src/domain/cycle/dto'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainKeyResultService from 'src/domain/key-result/service'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

import { Objective } from './entities'
import DomainObjectiveRepository from './repository'

export interface DomainObjectiveServiceInterface {
  getFromOwner: (owner: UserDTO) => Promise<Objective[]>
  getFromCycle: (cycle: CycleDTO) => Promise<Objective[]>
  getFromTeam: (team: TeamDTO) => Promise<Objective[]>
  getCurrentProgressForObjective: (objective: ObjectiveDTO) => Promise<KeyResultCheckIn['progress']>
  getCurrentConfidenceForObjective: (
    objective: ObjectiveDTO,
  ) => Promise<KeyResultCheckIn['confidence']>
  getObjectiveProgressIncreaseSinceLastWeek: (
    objective: ObjectiveDTO,
  ) => Promise<KeyResultCheckIn['progress']>
}

@Injectable()
class DomainObjectiveService
  extends DomainEntityService<Objective, ObjectiveDTO>
  implements DomainObjectiveServiceInterface {
  constructor(
    protected readonly repository: DomainObjectiveRepository,
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(DomainObjectiveService.name, repository)
  }

  public async getFromOwner(owner: UserDTO) {
    return this.repository.find({ ownerId: owner.id })
  }

  public async getFromCycle(cycle: CycleDTO) {
    return this.repository.find({ cycleId: cycle.id })
  }

  public async getFromTeam(team: TeamDTO) {
    const keyResults = await this.keyResultService.getFromTeams(team, ['objectiveId'])
    if (!keyResults) return []

    const objectiveIds = keyResults.map((keyResult) => keyResult.objectiveId)
    if (objectiveIds.length === 0) return []

    const objectives = await this.repository.find({ where: { id: Any(objectiveIds) } })

    return objectives
  }

  public async getCurrentProgressForObjective(objective: ObjectiveDTO) {
    const date = new Date()
    const currentCheckInGroup = await this.getCheckInGroupAtDateForObjective(date, objective)

    return currentCheckInGroup.progress
  }

  public async getCurrentConfidenceForObjective(objective: ObjectiveDTO) {
    const date = new Date()
    const currentCheckInGroup = await this.getCheckInGroupAtDateForObjective(date, objective)

    return currentCheckInGroup.confidence
  }

  public async getObjectiveProgressIncreaseSinceLastWeek(objective: ObjectiveDTO) {
    const progress = await this.getCurrentProgressForObjective(objective)
    const lastWeekProgress = await this.getLastWeekProgressForObjective(objective)

    const deltaProgress = progress - lastWeekProgress

    return deltaProgress
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<Objective>,
    _data: Partial<ObjectiveDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }

  private async getCheckInGroupAtDateForObjective(date: Date, objective: ObjectiveDTO) {
    const keyResults = await this.keyResultService.getFromObjective(objective)
    if (!keyResults) return this.keyResultService.buildDefaultCheckInGroup()

    const objectiveCheckInGroup = this.keyResultService.buildCheckInGroupForKeyResultListAtDate(
      date,
      keyResults,
    )

    return objectiveCheckInGroup
  }

  private async getLastWeekProgressForObjective(objective: ObjectiveDTO) {
    const firstDayAfterLastWeek = this.getFirstDayAfterLastWeek()

    const lastWeekCheckInGroup = await this.getCheckInGroupAtDateForObjective(
      firstDayAfterLastWeek,
      objective,
    )

    return lastWeekCheckInGroup.progress
  }
}

export default DomainObjectiveService
