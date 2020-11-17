import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, AuthzToken } from 'app/authz'

import KeyResultsService from './service'

export interface KeyResultsRequest {
  user: AuthzToken
}

@Controller('key-results')
class KeyResultsController {
  constructor(private readonly KeyResultsService: KeyResultsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @Permissions('read:key-results')
  getKeyResults(@Request() request: KeyResultsRequest): string {
    return this.KeyResultsService.getUserKeyResults(request.user.sub)
  }
}

export default KeyResultsController
