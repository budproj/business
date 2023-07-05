import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Stopwatch } from '@lib/logger/pino.decorator'

export interface GetTeamStatusOptions extends GetStatusOptions {
  cycleFilters?: Partial<CycleInterface>
}

export class GetTeamStatusCommand extends BaseStatusCommand {
  static isActive(keyResults: any[]): boolean {
    return keyResults.some((keyResult) => keyResult?.objective?.cycle?.active)
  }

  @Stopwatch()
  public async execute(
    teamID: string,
    options: GetTeamStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const anchorDate = new Date()
    const rawKeyResults = await this.getKeyResultsFromTeam(teamID, options)
    const keyResults = rawKeyResults.filter(
      (keyResult) => keyResult.objective.cycle.dateStart < anchorDate,
    )

    const [cycleCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(keyResults)

    const latestCheckIn = this.getLatestCheckInFromList(cycleCheckIns)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = GetTeamStatusCommand.isActive(keyResults)

    return {
      isOutdated,
      isActive,
      latestCheckIn,
      reportDate: latestCheckIn?.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
    }
  }

  private async getKeyResultsFromTeam(
    teamID: string,
    options: GetTeamStatusOptions,
  ): Promise<KeyResult[]> {
    const filters = {
      keyResult: {
        createdAt: options.date,
        mode: KeyResultMode.PUBLISHED,
      },
      team: {
        id: teamID,
      },
      cycle: options.cycleFilters,
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
