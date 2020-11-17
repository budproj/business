import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import KeyResultsService from './service'

@Controller('key-results')
class KeyResultsController {
  constructor(private readonly KeyResultsService: KeyResultsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getKeyResults(): string {
    return this.KeyResultsService.getKeyResults()
  }
}

export default KeyResultsController
