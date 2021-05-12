import { Injectable } from '@nestjs/common'

import { AccessControlScopes } from '@adapters/authorization/interfaces/access-control-scopes.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { KeyResultBaseAccessControl } from '@interface/graphql/modules/key-result/access-control/base.access-control'

type RelatedEntities = {
  keyResultComment: KeyResultComment
  keyResult: KeyResult
  teams: Team[]
}

@Injectable()
export class KeyResultCommentAccessControl extends KeyResultBaseAccessControl {
  protected readonly resource = Resource.KEY_RESULT_COMMENT

  constructor(protected core: CorePortsProvider) {
    super(core)
  }

  static isCommentAuthor(keyResultComment: KeyResultComment, user: UserWithContext): boolean {
    return keyResultComment.userId === user.id
  }

  protected async resolveContextScopes(
    user: UserWithContext,
    keyResultID: string,
  ): Promise<AccessControlScopes> {
    return this.resolveKeyResultContext(user, keyResultID)
  }

  protected async resolveEntityScopes(
    user: UserWithContext,
    keyResultCommentID: string,
  ): Promise<AccessControlScopes> {
    const { keyResultComment, keyResult, teams } = await this.getRelatedEntities(keyResultCommentID)

    const isCommentAuthor = KeyResultCommentAccessControl.isCommentAuthor(keyResultComment, user)
    const isTeamLeader = await this.isTeamLeader(teams, user)
    const isCompanyMember = await this.isKeyResultCompanyMember(keyResult, user)

    return {
      isTeamLeader,
      isCompanyMember,
      isOwner: isCommentAuthor,
    }
  }

  private async getRelatedEntities(keyResultCommentID: string): Promise<RelatedEntities> {
    const keyResultComment = await this.core.dispatchCommand<KeyResultComment>(
      'get-key-result-comment',
      { id: keyResultCommentID },
    )
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: keyResultComment.keyResultId,
    })
    const teams = await this.getKeyResultTeamTree(keyResult)

    return {
      keyResultComment,
      keyResult,
      teams,
    }
  }
}
