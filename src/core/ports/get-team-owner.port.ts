import { Injectable } from '@nestjs/common'

import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { UserProvider } from '@core/modules/user/user.provider'

import { Port } from './base.interface'

@Injectable()
export class GetTeamOwner implements Port<Promise<User>> {
  constructor(private readonly user: UserProvider) {}

  public async execute(team: TeamInterface): Promise<User> {
    const user = await this.user.getFromID(team.ownerId)

    return user
  }
}
