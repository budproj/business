import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCommentCommand extends Command<KeyResultComment> {
  public async execute(indexes: Partial<KeyResultCommentInterface>): Promise<KeyResultComment> {
    return this.core.keyResult.getKeyResultComment(indexes)
  }
}
