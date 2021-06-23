import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'

export class GetObjectiveStatusCommand extends BaseStatusCommand {
  public async execute(
    objectiveID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const keyResults = await this.getKeyResultsFromObjective(objectiveID, options)
    const [objectiveCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(keyResults)

    const latestCheckIn = this.getLatestCheckInFromList(objectiveCheckIns)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = await this.isActive(objectiveID)

    return {
      isOutdated,
      isActive,
      latestCheckIn,
      reportDate: latestCheckIn.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
    }
  }

  private async getKeyResultsFromObjective(
    objectiveID: string,
    options: GetStatusOptions,
  ): Promise<KeyResult[]> {
    const keyResultFilters = {
      checkIns: {
        createdAt: options.date,
      },
    }

    return this.core.keyResult.getAllFromObjectiveWithCheckIns(objectiveID, keyResultFilters)
  }

  private async isActive(objectiveID: string): Promise<boolean> {
    const objective = await this.core.objective.getFromID(objectiveID)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle.active
  }
}
