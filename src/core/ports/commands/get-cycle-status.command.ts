import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { KeyResultMode } from '@core/modules/key-result/enums/key-result-mode.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Cacheable } from '@lib/cache/cacheable.decorator'
import { Stopwatch } from '@lib/logger/pino.decorator'

/**
 * @deprecated prefer using the `CycleStatusProvider` instead
 */
export class GetCycleStatusCommand extends BaseStatusCommand {
  @Cacheable(
    (cycleID, options) => [cycleID, Math.floor(options?.date?.getTime() / (1000 * 60 * 60))],
    60 * 60,
  )
  @Stopwatch({ omitArgs: true })
  public async execute(
    cycleID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const keyResults = (await this.getKeyResultsFromCycle(cycleID, options)) as any

    const filteredKeyResults = keyResults.filter((keyResult) => keyResult.teamId !== null)

    const [cycleCheckIns, progresses, confidences] = await this.unzipKeyResultGroup(
      filteredKeyResults,
    )

    const latestCheckIn = this.getLatestCheckInFromList(cycleCheckIns)
    const isOutdated = this.isOutdated(latestCheckIn)
    const isActive = keyResults[0]?.objective?.cycle?.active ?? this.defaultStatus.isActive

    return {
      isOutdated,
      isActive,
      latestCheckIn,
      reportDate: latestCheckIn?.createdAt,
      progress: this.getAverage(progresses),
      confidence: this.getMin(confidences),
    }
  }

  private async getKeyResultsFromCycle(
    cycleID: string,
    options: GetStatusOptions,
  ): Promise<KeyResult[]> {
    const filters = {
      keyResult: {
        createdAt: options.date,
        mode: KeyResultMode.PUBLISHED,
      },
      cycle: {
        id: cycleID,
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
