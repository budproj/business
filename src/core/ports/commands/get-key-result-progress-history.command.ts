import { ProgressRecord } from '@adapters/analytics/progress-record.interface'

import { Command } from './base.command'

export class GetKeyResultProgressHistoryCommand extends Command<ProgressRecord[]> {
  public async execute(keyResultID: string): Promise<ProgressRecord[]> {
    return this.core.keyResult.getProgressHistoryForKeyResultID(keyResultID)
  }
}
