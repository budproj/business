import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'

import { AuthzUser } from 'app/authz/types'
import { AppRequest } from 'app/types'
import TeamService from 'domain/team/service'
import { User } from 'domain/user/entities'
import UserService from 'domain/user/service'

import GodUser from './god-user'

@Injectable()
export class EnhanceWithBudUser implements NestInterceptor {
  private readonly godMode: boolean
  private readonly logger = new Logger(EnhanceWithBudUser.name)
  private readonly godUser: AuthzUser = new GodUser()

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly teamService: TeamService,
  ) {
    this.godMode = this.configService.get<boolean>('godMode')
  }

  async intercept(rawContext: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const gqlContext = GqlExecutionContext.create(rawContext)
    const request: AppRequest = gqlContext.getContext().req

    if (this.godMode) return this.godBypass(request, next)

    const { teams, ...user }: User = await this.userService.getUserFromSubjectWithTeamRelation(
      request.user.token.sub,
    )

    request.user = {
      ...request.user,
      ...user,
      teams,
    }

    this.logger.debug({
      requestUser: request.user,
      message: `Selected user with ID ${user.id} for current request`,
    })

    return next.handle()
  }

  async godBypass(request: AppRequest, next: CallHandler): Promise<Observable<unknown>> {
    const teamsPromise = this.teamService.getAll()

    const user = {
      teams: await teamsPromise,
      id: this.godUser.id,
      name: this.godUser.name,
      authzSub: this.godUser.authzSub,
      role: this.godUser.role,
      token: this.godUser.token,
      picture: this.godUser.picture,
      createdAt: this.godUser.createdAt,
      updatedAt: this.godUser.updatedAt,
    }

    request.user = user

    return next.handle()
  }
}
