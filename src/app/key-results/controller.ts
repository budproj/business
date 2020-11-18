import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, AuthzToken } from 'app/authz'

import KeyResultsService from './service'

export interface KeyResultsRequest {
  user: AuthzToken
}

export interface GetKeyResultsQueryParameters {
  scope: 'user' | 'team' | 'company'
}

@Controller('key-results')
class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @Permissions('read:key-results')
  getKeyResults(
    @Request() request: KeyResultsRequest,
    @Query() query: GetKeyResultsQueryParameters,
  ): string {
    const handlers = {
      user: () => this.keyResultsService.getUserKeyResults(request.user.sub),
      team: () => this.keyResultsService.getUserTeamsKeyResults(request.user.sub),
      company: () => this.keyResultsService.getUserCompanyKeyResults(request.user.sub),
    }
    const { scope } = query
    const scopedHandler = handlers[scope]

    return scopedHandler()
  }
}

export default KeyResultsController
