import { FindConditions } from 'typeorm'

import { GetOptions } from '@core/interfaces/get-options'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUsersWithIndividualOkr extends Command<User[]> {
  public async execute(
    filters?: FindConditions<User>,
    options?: GetOptions<User>,
  ): Promise<User[]> {
    return this.core.user.getUsersWithObjectives(filters, options)
  }
}
