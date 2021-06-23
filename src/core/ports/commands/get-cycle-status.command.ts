import { CoreProvider } from '@core/core.provider'
import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export class GetCycleStatusCommand extends BaseStatusCommand {
  private readonly getObjectiveStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getObjectiveStatus = this.factory.buildCommand<Status>('get-objective-status')
  }

  public async execute(
    cycleID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const keyResults = (await this.getKeyResultsFromCycle(cycleID, options)) as any
    const [cycleCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(keyResults)

    const latestCheckIn = this.getLatestCheckInFromList(cycleCheckIns)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = keyResults[0]?.objective?.cycle?.active ?? this.defaultStatus.isActive

    return {
      isOutdated,
      isActive,
      latestCheckIn,
      reportDate: latestCheckIn.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
    }
  }

  private async getKeyResultsFromCycle(
    cycleID: string,
    options: GetStatusOptions,
  ): Promise<KeyResult[]> {
    const filters = {
      keyResultCheckIn: {
        createdAt: options.date,
      },
      cycle: {
        id: cycleID,
      },
    }

    return this.core.keyResult.getEntireOKRTreeWithFilters(filters)
  }
}
