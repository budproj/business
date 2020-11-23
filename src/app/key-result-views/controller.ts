import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  PreconditionFailedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, User, AuthzInterceptor } from 'app/authz'
import { PostKeyResultViewDTO } from 'app/key-result-views/dto'
import { Railway, UnknownRailwayError } from 'app/providers'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'

import { User as UserEntity } from '../../domain/user-aggregate/user/entities'

import KeyResultViewsService from './service'

@Controller('key-result-views')
@UseInterceptors(AuthzInterceptor)
class KeyResultViewsController {
  private readonly logger = new Logger(KeyResultViewsController.name)

  constructor(
    private readonly keyResultViewsService: KeyResultViewsService,
    private readonly railway: Railway,
  ) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:key-result-views')
  @Get()
  async getKeyResultViews(@User() user: UserEntity): Promise<KeyResultView[]> {
    this.logger.log(`Getting all key result views for user ${user.id.toString()}`)

    const views = await this.keyResultViewsService.getViewsForUser(user)
    this.logger.log({
      views,
      message: `Received user ${user.id.toString()} views`,
    })

    return views
  }

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:key-result-views')
  @Post()
  async postKeyResultViews(
    @User() user: UserEntity,
    @Body() keyResultView: PostKeyResultViewDTO,
  ): Promise<KeyResultView | PreconditionFailedException> {
    this.logger.log({
      keyResultView,
      message: `Creating new key result view for user ${user.id.toString()} with data:`,
    })

    const promise = this.keyResultViewsService.createKeyResultView(user, keyResultView)
    const [error, createdKeyResultView] = await this.railway.handleRailwayPromise<
      UnknownRailwayError,
      KeyResultView
    >(promise)
    if (error?.code === '23505')
      return new PreconditionFailedException('View bindings must be unique')

    this.logger.log({
      createdKeyResultView,
      message: `Created key result view for user ${user.id.toString()}`,
    })

    return createdKeyResultView
  }
}

export default KeyResultViewsController
