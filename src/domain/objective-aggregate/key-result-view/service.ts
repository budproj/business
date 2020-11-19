import { Injectable, Logger } from '@nestjs/common'

import { User } from 'domain/user-aggregate/user/entities'

import { IKeyResultView, IKeyResultViewBinding } from './dto'
import KeyResultViewRepository from './repository'

@Injectable()
class KeyResultViewService {
  private readonly logger = new Logger(KeyResultViewService.name)

  constructor(private readonly repository: KeyResultViewRepository) {}

  async getUserViewCustomRank(
    userID: User['id'],
    view: IKeyResultViewBinding,
  ): Promise<IKeyResultView['rank'] | []> {
    this.logger.debug(`Fetching user ${userID} custom "${view}" view rank`)

    const userCustomRank = await this.repository.selectViewRankForUserBinding(userID, view)
    this.logger.debug({
      userCustomRank,
      message: `Selected user ${userID} custom rank for view ${view}`,
    })

    return userCustomRank
  }
}

export default KeyResultViewService
