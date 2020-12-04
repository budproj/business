import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { uniq } from 'lodash'
import { Observable } from 'rxjs'

import { AppRequest } from 'app/types'
import TeamService from 'domain/team/service'
import { User } from 'domain/user/entities'
import UserService from 'domain/user/service'

import { RESOURCE, SCOPE, SCOPED_PERMISSION } from './constants'
import GodUser from './god-user'
import { AuthzUser } from './types'

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
    const scopes = this.parseScopesFromUserPermissions(
      request.user.token.permissions as SCOPED_PERMISSION[],
    )

    request.user = {
      ...request.user,
      ...user,
      teams,
      scopes,
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
      scopes: this.godUser.scopes,
      picture: this.godUser.picture,
      createdAt: this.godUser.createdAt,
      updatedAt: this.godUser.updatedAt,
    }

    request.user = user

    return next.handle()
  }

  parseScopesFromUserPermissions(permissions: SCOPED_PERMISSION[]): any {
    const keyResultScope = this.parseScopeForResource(RESOURCE.KEY_RESULT, permissions)
    const progressReportScope = this.parseScopeForResource(RESOURCE.PROGRESS_REPORT, permissions)
    const confidenceReportScope = this.parseScopeForResource(
      RESOURCE.CONFIDENCE_REPORT,
      permissions,
    )
    const companyScope = this.parseScopeForResource(RESOURCE.COMPANY, permissions)
    const cycleScope = this.parseScopeForResource(RESOURCE.CYCLE, permissions)
    const objectiveScope = this.parseScopeForResource(RESOURCE.OBJECTIVE, permissions)
    const teamScope = this.parseScopeForResource(RESOURCE.TEAM, permissions)
    const userScope = this.parseScopeForResource(RESOURCE.USER, permissions)
    const keyResultViewScope = this.parseScopeForResource(RESOURCE.KEY_RESULT_VIEW, permissions)

    return {
      [RESOURCE.KEY_RESULT]: keyResultScope,
      [RESOURCE.PROGRESS_REPORT]: progressReportScope,
      [RESOURCE.CONFIDENCE_REPORT]: confidenceReportScope,
      [RESOURCE.COMPANY]: companyScope,
      [RESOURCE.CYCLE]: cycleScope,
      [RESOURCE.OBJECTIVE]: objectiveScope,
      [RESOURCE.TEAM]: teamScope,
      [RESOURCE.USER]: userScope,
      [RESOURCE.KEY_RESULT_VIEW]: keyResultViewScope,
    }
  }

  parseScopeForResource(resource: RESOURCE, permissions: SCOPED_PERMISSION[]): SCOPE {
    const resourcePermissions = permissions.filter((permission) =>
      permission.includes(`${resource}:`),
    )
    const highestScope = this.getHighestScopeForPermissions(resourcePermissions)

    return highestScope
  }

  getHighestScopeForPermissions(permissions: SCOPED_PERMISSION[]): SCOPE {
    const scopeWeights = {
      [SCOPE.ANY]: 4,
      [SCOPE.COMPANY]: 3,
      [SCOPE.TEAM]: 2,
      [SCOPE.OWNS]: 1,
    }
    const scopeList = permissions.map((permission) => permission.split(':').slice(-1)[0] as SCOPE)
    const uniqueScopeList = uniq(scopeList)
    const weightedScopeList = uniqueScopeList.map((scope) => ({
      scope,
      weight: scopeWeights[scope],
    }))
    const sortedScopeList = weightedScopeList.sort((previous, next) =>
      previous.weight < next.weight ? 1 : -1,
    )

    const highestScope = sortedScopeList[0]

    return highestScope?.scope
  }
}
