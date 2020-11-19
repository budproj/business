import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, User, AuthzInterceptor } from 'app/authz'
import { IKeyResultViewBinding } from 'domain/objective-aggregate/key-result-view/dto'
import { KeyResultWithLatestReports } from 'domain/objective-aggregate/service'

import { User as UserEntity } from '../../domain/user-aggregate/user/entities'

import { GetKeyResultsDTO } from './dto'
import KeyResultsService from './service'

@Controller('key-results')
@UseInterceptors(AuthzInterceptor)
class KeyResultsController {
  constructor(private readonly keyResultsService: KeyResultsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:key-results')
  @Get()
  async getKeyResults(
    @User() user: UserEntity,
    @Query() { scope, view }: GetKeyResultsDTO,
  ): Promise<Array<Partial<KeyResultWithLatestReports>>> {
    const handlers = {
      user: async (view: IKeyResultViewBinding) =>
        this.keyResultsService.getUserKeyResultsFromView(user, view),
    }
    const scopedHandler = handlers[scope]
    const keyResults = await scopedHandler(view)

    return keyResults
  }
}

export default KeyResultsController
