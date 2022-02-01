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
    const isActive = await this.core.objective.isActive(objectiveID)

    return {
      isOutdated,
      isActive,
      latestCheckIn,
      reportDate: latestCheckIn?.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
    }
  }

  private async getKeyResultsFromObjective(
    objectiveID: string,
    options: GetStatusOptions,
  ): Promise<KeyResult[]> {
    const filters = {
      keyResult: {
        createdAt: options.date,
      },
      objective: {
        id: objectiveID,
      },
    }
    const orderAttributes = this.zipEntityOrderAttributes(
      ['keyResultCheckIn'],
      [['createdAt']],
      [['DESC']],
    )

    const keyResults = await this.core.keyResult.getWithRelationFilters(filters, orderAttributes)

    return this.removeKeyResultCheckInsBeforeDate(keyResults, options.date)
  }
}
