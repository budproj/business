import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCommentTeamCommand extends Command<Team> {
  public async execute(keyResultComment: KeyResultComment): Promise<Team> {
    const keyResult = await this.core.keyResult.getFromKeyResultCommentID(keyResultComment.id)
    return this.core.team.getFromIndexes({ id: keyResult.teamId })
  }
}
