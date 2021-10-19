import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-errors'

import { NewKeyResultSupportTeamMemberActivity } from '@adapters/activity/activities/new-key-result-support-team-member.activity'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { State } from '@adapters/state/interfaces/state.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { AttachActivity } from '@interface/graphql/adapters/activity/attach-activity.decorator'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestState } from '@interface/graphql/adapters/context/decorators/request-state.decorator'

import { KeyResultAccessControl } from '../../access-control/key-result.access-control'
import { KeyResultGraphQLNode } from '../../key-result.node'

import { KeyResultKeyResultSupportTeamGraphQLConnection } from './key-result-key-result-support-team.connection'
import {
  KeyResultSupportTeamCreateRequest,
  KeyResultSupportTeamRemoveRequest,
} from './requests/key-result-add-support-team.request'

@GuardedResolver(KeyResultKeyResultSupportTeamGraphQLConnection)
export class KeyResultKeyResultSupportTeamConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  User,
  UserInterface
> {
  private readonly logger = new Logger(KeyResultKeyResultSupportTeamConnectionGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    accessControl: KeyResultAccessControl,
  ) {
    super(Resource.KEY_RESULT_SUPPORT_TEAM, core, core.user, accessControl)
  }

  @AttachActivity(NewKeyResultSupportTeamMemberActivity)
  @GuardedMutation(KeyResultGraphQLNode, 'key-result:update', {
    name: 'addUserAsSupportTeamToKeyResult',
  })
  protected async addUser(
    @Args() request: KeyResultSupportTeamCreateRequest,
    @RequestState() state: State,
  ) {
    const canUpdate = await this.accessControl.canUpdate(state.user, request.data.keyResultId)
    if (!canUpdate) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received add user to support team request',
    })

    const keyResult = await this.corePorts.dispatchCommand<KeyResult>('get-key-result', {
      id: request.data.keyResultId,
    })

    if (!keyResult) throw new UserInputError(`We could not find your Key Result`)

    await this.corePorts.dispatchCommand<void>(
      'add-user-to-key-result-support-team',
      request.data.keyResultId,
      request.data.userId,
    )

    return keyResult
  }

  @GuardedMutation(KeyResultGraphQLNode, 'key-result:update', {
    name: 'removeUserAsSupportTeamToKeyResult',
  })
  protected async removeUser(
    @Args() request: KeyResultSupportTeamRemoveRequest,
    @RequestState() state: State,
  ) {
    const canUpdate = await this.accessControl.canUpdate(state.user, request.data.keyResultId)
    if (!canUpdate) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received remove user to support team request',
    })

    const keyResult = await this.corePorts.dispatchCommand<KeyResult>('get-key-result', {
      id: request.data.keyResultId,
    })

    if (!keyResult) throw new UserInputError(`We could not find your Key Result`)

    await this.corePorts.dispatchCommand<void>(
      'remove-user-to-key-result-support-team',
      request.data.keyResultId,
      request.data.userId,
    )

    return keyResult
  }
}
