import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, AuthzToken, User, AuthzInterceptor } from 'app/authz'

import { User as UserEntity } from '../../domain/user-aggregate/user/entities'

import KeyResultsService, { KeyResultsHashmap } from './service'

export interface KeyResultsRequest {
  user: AuthzToken
}

export interface GetKeyResultsQueryParameters {
  scope: 'user' | 'team' | 'company'
}

@Controller('key-results')
@UseInterceptors(AuthzInterceptor)
class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @Permissions('read:key-results')
  async getKeyResultsHashmap(
    @Query() query: GetKeyResultsQueryParameters,
    @User() user: UserEntity,
  ): Promise<KeyResultsHashmap> {
    const handlers = {
      user: async () => this.keyResultsService.getUserKeyResults(user.id),
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
