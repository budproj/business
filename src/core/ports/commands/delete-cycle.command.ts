import { DeleteResult } from 'typeorm'

import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'

import { Command } from './base.command'

export class DeleteCycleCommand extends Command<DeleteResult> {
  public async execute(id: CycleInterface['id']) {
    return this.core.cycle.delete({ id })
  }
}
