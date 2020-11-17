import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard } from 'app/authz'

import KeyResultsService from './service'

@Controller('key-results')
class KeyResultsController {
  constructor(private readonly KeyResultsService: KeyResultsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Get()
  @Permissions('read:key-results')
  getKeyResults(): string {
    return this.KeyResultsService.getKeyResults()
  }
}

export default KeyResultsController
