import { Injectable } from '@nestjs/common'

import { TeamProvider } from './modules/team/team.provider'
import { UserProvider } from './modules/user/user.provider'

@Injectable()
export class CoreProvider {
  constructor(public readonly user: UserProvider, public readonly team: TeamProvider) {}
}
