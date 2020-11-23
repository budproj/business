import { Injectable, Logger } from '@nestjs/common'

import { User } from 'domain/user-aggregate/user/entities'

import { KeyResultViewDTO, KeyResultViewBinding } from './dto'
import KeyResultViewRepository from './repository'

@Injectable()
class KeyResultViewService {
  private readonly logger = new Logger(KeyResultViewService.name)

  constructor(private readonly repository: KeyResultViewRepository) {}

  async getUserViewWithBinding(
    userID: User['id'],
    viewBinding: KeyResultViewBinding,
  ): Promise<KeyResultViewDTO> {
    this.logger.debug(`Fetching user ${userID} custom "${viewBinding}" view rank`)

    const userView = await this.repository.selectViewForUserBinding(userID, viewBinding)
    this.logger.debug({
      userView,
      message: `Selected user ${userID} custom rank for view ${viewBinding}`,
    })

    return userView
  }
}

export default KeyResultViewService
