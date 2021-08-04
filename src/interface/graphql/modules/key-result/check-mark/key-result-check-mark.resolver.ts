import { Resource } from "@adapters/policy/enums/resource.enum";
import { CoreProvider } from "@core/core.provider";
import { KeyResultCheckMarkInterface } from "@core/modules/key-result/check-mark/key-result-check-mark.interface";
import { KeyResultCheckMark } from "@core/modules/key-result/check-mark/key-result-check-mark.orm-entity";
import { CorePortsProvider } from "@core/ports/ports.provider";
import { GuardedMutation } from "@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator";
import { GuardedResolver } from "@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator";
import { GuardedNodeGraphQLResolver } from "@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver";
import { RequestState } from "@interface/graphql/adapters/context/decorators/request-state.decorator";
import { GraphQLRequestState } from "@interface/graphql/adapters/context/interfaces/request-state.interface";
import { Logger, UnauthorizedException } from "@nestjs/common";
import { Args } from "@nestjs/graphql";
import { KeyResultCheckMarkAccessControl } from "../access-control/key-result-check-mark.access-control";
import { KeyResultCheckMarkGraphQLNode } from "./key-result-check-mark.node";
import { KeyResultCheckMarkCreateRequest } from "./requests/key-result-check-mark-create.request";
import { Status } from '@core/interfaces/status.interface'
import { UserInputError } from "apollo-server-fastify";

@GuardedResolver(KeyResultCheckMarkGraphQLNode)
export class KeyResultCheckMarkGraphQLResolver extends GuardedNodeGraphQLResolver<
KeyResultCheckMark,
KeyResultCheckMarkInterface
> {
  private readonly logger = new Logger(KeyResultCheckMarkGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    accessControl: KeyResultCheckMarkAccessControl,
  ) {
    super(Resource.KEY_RESULT_CHECK_MARK, core, core.keyResult.keyResultCheckMarkProvider, accessControl)
  }

  @GuardedMutation(KeyResultCheckMarkGraphQLNode, 'key-result-check-mark:create', {
    name: 'createKeyResultCheckMark',
  })
  protected async createKeyResultCheckMark(
    @Args() request: KeyResultCheckMarkCreateRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    const canCreate = await this.accessControl.canCreate(state.user, request.data.keyResultId)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received create check mark request',
    })

    const keyResultStatus = await this.corePorts.dispatchCommand<Status>(
      'get-key-result-status',
      request.data.keyResultId,
    )
    if (!keyResultStatus.isActive)
      throw new UserInputError(
        'You cannot create this keyResultCheckMark, because that key-result is not active anymore',
      )

    const createdCheckMark = await this.corePorts.dispatchCommand<KeyResultCheckMark>(
      'create-check-mark',
      { checkMark: request.data, user: state.user },
    )

    if (!createdCheckMark) throw new UserInputError('We were not able to create your comment')

    return createdCheckMark
  }
}
