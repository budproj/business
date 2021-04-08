import { Injectable } from '@nestjs/common'

import { CycleProvider } from './modules/cycle/cycle.provider'
import { ObjectiveProvider } from './modules/objective/objective.provider'
import { TeamProvider } from './modules/team/team.provider'
import { UserProvider } from './modules/user/user.provider'

@Injectable()
export class CoreProvider {
  constructor(
    public readonly user: UserProvider,
    public readonly team: TeamProvider,
    public readonly cycle: CycleProvider,
    public readonly objective: ObjectiveProvider,
  ) {}
}
