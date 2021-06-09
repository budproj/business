import { DeleteResult } from 'typeorm'

import { Command } from './base.command'

export class DeleteKeyResultCommand extends Command<DeleteResult> {
  public async execute(keyResultID: string): Promise<DeleteResult> {
    return this.core.keyResult.deleteFromID(keyResultID)
  }
}
