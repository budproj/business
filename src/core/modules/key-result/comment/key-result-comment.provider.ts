import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { CreationQuery } from '@core/types/creation-query.type'

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
