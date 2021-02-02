import { Injectable, CallHandler } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { uniq } from 'lodash'
import { Observable } from 'rxjs'

import { AppRequest } from 'src/app/types'
import { CONSTRAINT } from 'src/domain/constants'
import DomainService from 'src/domain/service'

import { ACTION, RESOURCE, SCOPED_PERMISSION } from './constants'
import AuthzGodUser from './god-user'
import { AuthzScopeGroup, AuthzScopes } from './types'

export interface AuthzServiceInterface {
  godBypass: (request: AppRequest, next: CallHandler) => Promise<Observable<any>>
  parseActionScopesFromUserPermissions: (permissions: SCOPED_PERMISSION[]) => AuthzScopes
}

@Injectable()
class AuthzService implements AuthzServiceInterface {
  constructor(
    private readonly configService: ConfigService,
    private readonly godUser: AuthzGodUser,
    private readonly domain: DomainService,
  ) {}

  public async godBypass(request: AppRequest, next: CallHandler) {
    const godContext = {
      user: {},
      constraint: CONSTRAINT.ANY,
    }

    const teamsPromise = this.domain.team.getManyWithConstraint(
      { id: this.configService.get('godMode.teamID') },
      godContext as any,
    )

    const user = {
      teams: await teamsPromise,
      id: this.godUser.id,
      firstName: this.godUser.firstName,
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

  public parseActionScopesFromUserPermissions(permissions: SCOPED_PERMISSION[]) {
    const userActionScopes = this.parseActionScopesForResource(RESOURCE.USER, permissions)
    const teamActionScopes = this.parseActionScopesForResource(RESOURCE.TEAM, permissions)
    const cycleActionScopes = this.parseActionScopesForResource(RESOURCE.CYCLE, permissions)
    const objectiveActionScopes = this.parseActionScopesForResource(RESOURCE.OBJECTIVE, permissions)
    const keyResultActionScopes = this.parseActionScopesForResource(
      RESOURCE.KEY_RESULT,
      permissions,
    )
    const keyResultCheckInActionScopes = this.parseActionScopesForResource(
      RESOURCE.KEY_RESULT_CHECK_IN,
      permissions,
    )
    const keyResultCommentActionScopes = this.parseActionScopesForResource(
      RESOURCE.KEY_RESULT_CHECK_IN,
      permissions,
    )
    const keyResultCustomListActionScopes = this.parseActionScopesForResource(
      RESOURCE.KEY_RESULT_CHECK_IN,
      permissions,
    )

    return {
      [RESOURCE.USER]: userActionScopes,
      [RESOURCE.TEAM]: teamActionScopes,
      [RESOURCE.CYCLE]: cycleActionScopes,
      [RESOURCE.OBJECTIVE]: objectiveActionScopes,
      [RESOURCE.KEY_RESULT]: keyResultActionScopes,
      [RESOURCE.KEY_RESULT_CHECK_IN]: keyResultCheckInActionScopes,
      [RESOURCE.KEY_RESULT_COMMENT]: keyResultCommentActionScopes,
      [RESOURCE.KEY_RESULT_CUSTOM_LIST]: keyResultCustomListActionScopes,
    }
  }

  private parseActionScopesForResource(
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

  private parseActionScopeForResource(
    action: ACTION,
    resource: RESOURCE,
    permissions: SCOPED_PERMISSION[],
  ): CONSTRAINT {
    const resourcePermissions = permissions.filter((permission) =>
      permission.includes(`${resource}:${action}`),
    )
    const highestScope = this.getHighestScopeForPermissions(resourcePermissions)

    return highestScope
  }

  private getHighestScopeForPermissions(permissions: SCOPED_PERMISSION[]): CONSTRAINT {
    const scopeWeights = {
      [CONSTRAINT.ANY]: 4,
      [CONSTRAINT.COMPANY]: 3,
      [CONSTRAINT.TEAM]: 2,
      [CONSTRAINT.OWNS]: 1,
    }
    const scopeList = permissions.map(
      (permission) => permission.split(':').slice(-1)[0] as CONSTRAINT,
    )
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

export default AuthzService
