import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUserWithTeamsBySubCommand extends Command<User> {
  public async execute(authzSub: UserInterface['authzSub']): Promise<User> {
    return this.core.user.getUserFromSubjectWithTeamRelation(authzSub)
  }
}
