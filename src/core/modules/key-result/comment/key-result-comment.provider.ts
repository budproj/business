import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Any, DeleteResult } from 'typeorm'

import { EventPublisher } from '@core/common/messaging/base-scenarios/abstract'
import { CommentOnBarrierKREvent } from '@core/common/messaging/base-scenarios/comment-on-barrier-kr.event'
import { CommentOnKREvent } from '@core/common/messaging/base-scenarios/comment-on-kr.event'
import { CommentOnLowConfidenceKREvent } from '@core/common/messaging/base-scenarios/comment-on-low-confidence-kr.event'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { TeamProvider } from '@core/modules/team/team.provider'
import { CreationQuery } from '@core/types/creation-query.type'
import {
  COMMENT_BARRIER_KR_TASK_TEMPLATE_ID,
  COMMENT_KR_TASK_TEMPLATE_ID,
  COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
} from 'src/mission-control/domain/tasks/constants'

import { KeyResultTimelineQueryResult } from '../interfaces/key-result-timeline-query-result.interface'
import { KeyResultProvider } from '../key-result.provider'

import { KeyResultCommentInterface } from './key-result-comment.interface'
import { KeyResultComment } from './key-result-comment.orm-entity'
import { KeyResultCommentRepository } from './key-result-comment.repository'

@Injectable()
export class KeyResultCommentProvider extends CoreEntityProvider<
  KeyResultComment,
  KeyResultCommentInterface
> {
  private keyResultProvider: KeyResultProvider

  constructor(
    protected readonly repository: KeyResultCommentRepository,
    private readonly moduleReference: ModuleRef,
    private readonly fulfillerTaskPublisher: EventPublisher,
    private readonly teamProvider: TeamProvider,
  ) {
    super(KeyResultCommentProvider.name, repository)
  }

  public async getForTimelineEntries(
    entries: KeyResultTimelineQueryResult[],
  ): Promise<KeyResultComment[]> {
    const commentIDs = entries.map((entry) => entry.id)
    const result = await this.repository.findByIds(commentIDs)

    return result
  }

  public async createComment(
    comment: Partial<KeyResultCommentInterface>,
  ): Promise<KeyResultComment[]> {
    const keyResult = await this.keyResultProvider.getFromID(comment.keyResultId)
    const latestCheckIn =
      await this.keyResultProvider.keyResultCheckInProvider.getLatestFromKeyResult(keyResult)
    const company = await this.teamProvider.getAscendantsByIds([keyResult.teamId], {})

    const messageInterface = {
      userId: comment.userId,
      companyId: company[0].id,
      date: Date.now(),
      payload: {
        teamId: keyResult.teamId,
        keyResultId: comment.keyResultId,
      },
    }

    if (latestCheckIn) {
      if (latestCheckIn.confidence === -1) {
        await this.fulfillerTaskPublisher.publish<CommentOnBarrierKREvent>(
          COMMENT_BARRIER_KR_TASK_TEMPLATE_ID,
          {
            ...messageInterface,
          },
        )
      }

      if (latestCheckIn.confidence > 0 || latestCheckIn.confidence <= 32) {
        await this.fulfillerTaskPublisher.publish<CommentOnLowConfidenceKREvent>(
          COMMENT_LOW_CONFIDENCE_KR_TASK_TEMPLATE_ID,
          {
            ...messageInterface,
          },
        )
      }
    }

    await this.fulfillerTaskPublisher.publish<CommentOnKREvent>(COMMENT_KR_TASK_TEMPLATE_ID, {
      ...messageInterface,
    })

    return this.create(comment)
  }

  public async deleteFromObjective(objectiveID: string): Promise<DeleteResult> {
    const objectiveComments = await this.repository.getFromObjective(objectiveID)
    const objectiveCommentIDs = objectiveComments.map((comment) => comment.id)

    return this.delete({
      id: Any(objectiveCommentIDs),
    })
  }

  protected onModuleInit(): void {
    this.keyResultProvider = this.moduleReference.get(KeyResultProvider)
  }

  protected async protectCreationQuery(
    query: CreationQuery<KeyResultComment>,
    data: Partial<KeyResultCommentInterface>,
    queryContext: CoreQueryContext,
  ) {
    const selector = { id: data.keyResultId }

    const validationData = await this.keyResultProvider.getOneWithConstraint(selector, queryContext)
    if (!validationData) return

    return query()
  }
}
