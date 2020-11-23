import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  PreconditionFailedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, User, AuthzInterceptor } from 'app/authz'
import { PatchKeyResultViewDTO, PostKeyResultViewDTO } from 'app/key-result-views/dto'
import { Railway } from 'app/providers'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import { RailwayError } from 'errors'
import ResourceNotAllowed from 'errors/resource-not-allowed'

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
      RailwayError,
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

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('update:key-result-views')
  @Patch('/:id')
  async patchKeyResultViews(
    @User() user: UserEntity,
    @Body() keyResultView: PatchKeyResultViewDTO,
    @Param('id') id: number,
  ): Promise<KeyResultView | PreconditionFailedException> {
    this.logger.log({
      keyResultView,
      message: `Updating existing key result view with id ${id.toString()} for user ${user.id.toString()} with data:`,
    })

    const promise = this.keyResultViewsService.updateOwnedKeyResultView(user, id, keyResultView)
    const [error, updatedKeyResultView] = await this.railway.handleRailwayPromise<
      RailwayError,
      KeyResultView
    >(promise)
    if (error?.code === ResourceNotAllowed.code) return new ForbiddenException(error.message)
    if (error?.code === '23505')
      return new PreconditionFailedException('View bindings must be unique')

    this.logger.log({
      updatedKeyResultView,
      message: `Updated key result view for user ${user.id.toString()}`,
    })

    return updatedKeyResultView
  }
}

export default KeyResultViewsController
