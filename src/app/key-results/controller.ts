import { BadRequestException, Controller, Get, Query, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, AuthzToken } from 'app/authz'

import KeyResultsService, { KeyResultsHashmap } from './service'

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
  async getKeyResultsHashmap(
    @Request() request: KeyResultsRequest,
    @Query() query: GetKeyResultsQueryParameters,
  ): Promise<KeyResultsHashmap> {
    const handlers = {
      user: async () => this.keyResultsService.getUserKeyResults(request.user.sub),
    }
    const { scope } = query
    const scopedHandler = handlers[scope]
    if (!scopedHandler)
      throw new BadRequestException(
        `Invalid scope. Valid scopes are: ${Object.keys(handlers).join(', ')}`,
      )
    const keyResults = await scopedHandler()

    const keyResultsHashmap = this.keyResultsService.buildHashmap(keyResults)

    return keyResultsHashmap
  }
}

export default KeyResultsController
