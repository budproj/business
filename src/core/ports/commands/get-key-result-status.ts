import { Command } from './base.command'

export interface KeyResultStatus {
  progress: number
  confidence: number
  reportDate: Date
}

export class GetKeyResultStatusCommand extends Command<KeyResultStatus> {
  public async execute(keyResultID: string): Promise<KeyResultStatus> {
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(keyResultID)
    const keyResultProgress = await this.core.keyResult.getCheckInProgress(latestCheckIn)

    return {
      progress: keyResultProgress,
      confidence: latestCheckIn.confidence,
      reportDate: latestCheckIn.createdAt,
    }
  }
}
