import { Logger } from '@nestjs/common'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { TaskInterface } from '@core/modules/task/task.interface'
import { Task } from '@core/modules/task/task.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'

import { UserAccessControl } from '../user.access-control'

export class TaskGraphQLResolver extends GuardedNodeGraphQLResolver<Task, TaskInterface> {
  private readonly logger = new Logger(TaskGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected accessControl: UserAccessControl,
    private readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.USER_TASK, core, core.task, accessControl)
  }
}
