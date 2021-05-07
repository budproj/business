import { ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

import { GodBypass } from '@adapters/authorization/godmode/decorators/god-bypass.decorator'
import { GodmodeProvider } from '@adapters/authorization/godmode/godmode.provider'
import { GraphQLConfigProvider } from '@config/graphql/graphql.provider'

@Injectable()
export class TokenGraphQLGuard extends AuthGuard('jwt') {
  protected readonly godmode: GodmodeProvider
  private readonly logger = new Logger(TokenGraphQLGuard.name)

  constructor(private readonly config: GraphQLConfigProvider) {
    super()

    this.godmode = new GodmodeProvider(this.config.godmode)
  }

  @GodBypass(true)
  public canActivate(
    executionContext: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const graphqlExecutionContext = GqlExecutionContext.create(executionContext)
    const request = graphqlExecutionContext.getContext().req
    const guardRequest = () => super.canActivate(new ExecutionContextHost([request]))

    this.logger.debug({
      message: 'Evaluating if we should allow request',
    })

    return guardRequest()
  }
}
