import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'

import { Command } from './base.command'

export class CreateKeyResultCommentCommand extends Command<KeyResultComment> {
  public async execute(comment: Partial<KeyResultComment>): Promise<KeyResultComment> {
    const createdComment = await this.core.keyResult.createComment(comment)

    return createdComment
  }
}
