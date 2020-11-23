import { Controller, Get, Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, User, AuthzInterceptor } from 'app/authz'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'

import { User as UserEntity } from '../../domain/user-aggregate/user/entities'

import KeyResultViewsService from './service'

@Controller('key-result-views')
@UseInterceptors(AuthzInterceptor)
class KeyResultViewsController {
  private readonly logger = new Logger(KeyResultViewsController.name)

  constructor(private readonly keyResultViewsService: KeyResultViewsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:key-result-views')
  @Get()
  async getKeyResultViews(@User() user: UserEntity): Promise<KeyResultView[]> {
    this.logger.log(`Getting all key result views for user ${user.id.toString()}`)

    const views = await this.keyResultViewsService.getViewsForUser(user)

    return views
  }
}

export default KeyResultViewsController
