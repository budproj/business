import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

import { AuthJwtProvider } from '@infrastructure/authz/providers/jwt.provider'
import { NatsProvider } from '@interface/nats/nats.provider'

import { CycleProvider } from './modules/cycle/cycle.provider'
import { KeyResultProvider } from './modules/key-result/key-result.provider'
import { ObjectiveProvider } from './modules/objective/objective.provider'
import { TaskProvider } from './modules/task/task.provider'
import { TeamProvider } from './modules/team/team.provider'
import { UserProvider } from './modules/user/user.provider'

@Injectable()
export class CoreProvider {
  constructor(
    @InjectEntityManager() public entityManager: EntityManager,
    public readonly user: UserProvider,
    public readonly team: TeamProvider,
    public readonly cycle: CycleProvider,
    public readonly objective: ObjectiveProvider,
    public readonly keyResult: KeyResultProvider,
    public readonly task: TaskProvider,
    public readonly jwt: AuthJwtProvider,
    public readonly nats: NatsProvider,
  ) {}
}
