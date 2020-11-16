import { Controller, Get } from '@nestjs/common'

import KeyResultsService from './service'

@Controller()
class KeyResultsController {
  constructor(private readonly KeyResultsService: KeyResultsService) {}

  @Get('/key-results')
  getKeyResults(): string {
    return this.KeyResultsService.getKeyResults()
  }
}

export default KeyResultsController
