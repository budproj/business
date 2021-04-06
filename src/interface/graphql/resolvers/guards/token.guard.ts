import { ExecutionContext, Injectable, Logger } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'
import { Observable } from 'rxjs'

@Injectable()
export class GraphQLTokenGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(GraphQLTokenGuard.name)

  public canActivate(
    executionContext: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const graphqlContext = GqlExecutionContext.create(executionContext)
    const request = graphqlContext.getContext().req
    const guardRequest = () => super.canActivate(new ExecutionContextHost([request]))

    this.logger.debug({
      message: 'Evaluating if we should allow request',
    })

    return guardRequest()
  }
}
