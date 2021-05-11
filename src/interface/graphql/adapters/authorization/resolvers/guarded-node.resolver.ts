import { NotImplementedException } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'

import { AccessControl } from '@adapters/authorization/access-control.adapter'
import { QueryGuardAdapter } from '@adapters/authorization/query-guard.adapter'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { PolicyAdapter } from '@adapters/policy/policy.adapter'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreEntityInterface } from '@core/core-entity.interface'
import { CoreEntity } from '@core/core.orm-entity'
import { CoreProvider } from '@core/core.provider'
import { CoreEntityProvider } from '@core/entity.provider'
import { NodePolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/node-policy.object'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'

import { GuardedNodeGraphQLInterface } from '../interfaces/guarded-node.interface'

@Resolver(() => GuardedNodeGraphQLInterface)
export abstract class GuardedNodeGraphQLResolver<
  E extends CoreEntity,
  I extends CoreEntityInterface
> extends BaseGraphQLResolver {
  protected readonly queryGuard: QueryGuardAdapter<E, I>
  private readonly policyAdapter = new PolicyAdapter()

  protected constructor(
    protected readonly resource: Resource,
    protected readonly core: CoreProvider,
    coreEntityProvider: CoreEntityProvider<E, I>,
    protected readonly accessControl?: AccessControl,
  ) {
    super()

    this.queryGuard = new QueryGuardAdapter(resource, core, coreEntityProvider)
  }

  @ResolveField('policy', () => NodePolicyGraphQLObject)
  protected async resolveNodePolicy(
    @Parent() node: GuardedNodeGraphQLInterface,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    if (!this.accessControl) {
      throw new NotImplementedException(
        'You are trying to fetch policy, but this entity policy resolver is not implemented yet',
      )
    }

    return this.getNodePolicyForUserWithArgs(userWithContext, node.id)
  }

  protected async getNodePolicyForUserWithArgs(
    userWithContext: UserWithContext,
    ...indexArguments: string[]
  ) {
    const canRead = await this.accessControl.canRead(userWithContext, ...indexArguments)
    const canUpdate = await this.accessControl.canUpdate(userWithContext, ...indexArguments)
    const canDelete = await this.accessControl.canDelete(userWithContext, ...indexArguments)

    return {
      read: this.policyAdapter.getEffectForBoolean(canRead),
      update: this.policyAdapter.getEffectForBoolean(canUpdate),
      delete: this.policyAdapter.getEffectForBoolean(canDelete),
    }
  }
}
