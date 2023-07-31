import { Logger } from '@nestjs/common'
import { Args, Context, Parent, ResolveField } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultUpdateInterface } from '@core/modules/key-result/update/key-result-update.interface'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { IDataloaders } from '@interface/graphql/dataloader/dataloader.service'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultAccessControl } from '../access-control/key-result.access-control'
import { KeyResultGraphQLNode } from '../key-result.node'

import { KeyResultUpdateGraphQLNode } from './key-result-update.node'

@GuardedResolver(KeyResultUpdateGraphQLNode)
export class KeyResultUpdateGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultUpdate,
  KeyResultUpdateInterface
> {
  private readonly logger = new Logger(KeyResultUpdateGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    accessControl: KeyResultAccessControl,
  ) {
    super(Resource.KEY_RESULT, core, core.keyResult.keyResultUpdateProvider, accessControl)
  }

  @GuardedQuery(KeyResultUpdateGraphQLNode, 'key-result:read', {
    name: 'keyResultUpdate',
  })
  protected async getKeyResultUpdateForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    this.logger.log({
      request,
      message: 'Fetching key-result update with provided indexes',
    })

    // eslint-disable-next-line capitalized-comments
    // const keyResultUpdate = await this.queryGuard.getOneWithActionScopeConstraint(request, userWithContext)
    // if (!keyResultUpdate)
    //   throw new UserInputError(`We could not found an key-result update with the provided arguments`)
    //
    // return keyResultUpdate

    return loaders.keyResultUpdate.load(request.id)
  }

  @ResolveField('keyResult', () => KeyResultGraphQLNode)
  protected async getKeyResultForKeyResultUpdate(
    @Parent() keyResultUpdate: KeyResultUpdateGraphQLNode,
    @Context() { loaders }: { loaders: IDataloaders },
  ) {
    this.logger.log({
      keyResultUpdate,
      message: 'Fetching key result for key result update',
    })

    return loaders.keyResult.load(keyResultUpdate.keyResultId)
  }
}
