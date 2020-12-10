import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { uniq } from 'lodash'
import { Observable } from 'rxjs'

import { AppRequest } from 'app/types'
import TeamService from 'domain/team/service'
import { User } from 'domain/user/entities'
import UserService from 'domain/user/service'

import { ACTION, RESOURCE, SCOPE, SCOPED_PERMISSION } from './constants'
import GodUser from './god-user'
import { AuthzScopeGroup, AuthzUser } from './types'

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
    const scopes = this.parseActionScopesFromUserPermissions(
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

  parseActionScopesFromUserPermissions(permissions: SCOPED_PERMISSION[]): any {
    const keyResultActionScopes = this.parseActionScopesForResource(
      RESOURCE.KEY_RESULT,
      permissions,
    )
    const progressReportActionScopes = this.parseActionScopesForResource(
      RESOURCE.PROGRESS_REPORT,
      permissions,
    )
    const confidenceReportActionScopes = this.parseActionScopesForResource(
      RESOURCE.CONFIDENCE_REPORT,
      permissions,
    )
    const companyActionScopes = this.parseActionScopesForResource(RESOURCE.COMPANY, permissions)
    const cycleActionScopes = this.parseActionScopesForResource(RESOURCE.CYCLE, permissions)
    const objectiveActionScopes = this.parseActionScopesForResource(RESOURCE.OBJECTIVE, permissions)
    const teamActionScopes = this.parseActionScopesForResource(RESOURCE.TEAM, permissions)
    const userActionScopes = this.parseActionScopesForResource(RESOURCE.USER, permissions)
    const keyResultViewActionScopes = this.parseActionScopesForResource(
      RESOURCE.KEY_RESULT_VIEW,
      permissions,
    )

    return {
      [RESOURCE.KEY_RESULT]: keyResultActionScopes,
      [RESOURCE.PROGRESS_REPORT]: progressReportActionScopes,
      [RESOURCE.CONFIDENCE_REPORT]: confidenceReportActionScopes,
      [RESOURCE.COMPANY]: companyActionScopes,
      [RESOURCE.CYCLE]: cycleActionScopes,
      [RESOURCE.OBJECTIVE]: objectiveActionScopes,
      [RESOURCE.TEAM]: teamActionScopes,
      [RESOURCE.USER]: userActionScopes,
      [RESOURCE.KEY_RESULT_VIEW]: keyResultViewActionScopes,
    }
  }

  parseActionScopesForResource(
    resource: RESOURCE,
    permissions: SCOPED_PERMISSION[],
  ): AuthzScopeGroup {
    const createScope = this.parseActionScopeForResource(ACTION.CREATE, resource, permissions)
    const readScope = this.parseActionScopeForResource(ACTION.READ, resource, permissions)
    const updateScope = this.parseActionScopeForResource(ACTION.UPDATE, resource, permissions)
    const deleteScope = this.parseActionScopeForResource(ACTION.DELETE, resource, permissions)

    return {
      [ACTION.CREATE]: createScope,
      [ACTION.READ]: readScope,
      [ACTION.UPDATE]: updateScope,
      [ACTION.DELETE]: deleteScope,
    }
  }

  parseActionScopeForResource(
    action: ACTION,
    resource: RESOURCE,
    permissions: SCOPED_PERMISSION[],
  ): SCOPE {
    const resourcePermissions = permissions.filter((permission) =>
      permission.includes(`${resource}:${action}`),
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
