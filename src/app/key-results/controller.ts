import {
  BadRequestException,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, User, AuthzInterceptor } from 'app/authz'
import { KeyResultWithLatestReports } from 'domain/objective-aggregate/service'

import { User as UserEntity } from '../../domain/user-aggregate/user/entities'

import KeyResultsService from './service'

export interface GetKeyResultsHashmapQueryParameters {
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
    @Query() query: GetKeyResultsHashmapQueryParameters,
    @User() user: UserEntity,
  ): Promise<Array<Partial<KeyResultWithLatestReports>>> {
    const handlers = {
      user: async () => this.keyResultsService.getUserKeyResults(user),
    }
    const { scope } = query
    const scopedHandler = handlers[scope]
    if (!scopedHandler)
      throw new BadRequestException(
        `Invalid scope. Valid scopes are: ${Object.keys(handlers).join(', ')}`,
      )
    const keyResults = await scopedHandler()

    return keyResults
  }
}

export default KeyResultsController
