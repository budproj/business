import { forwardRef, Inject, Injectable } from '@nestjs/common'

import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import DomainKeyResultService from 'src/domain/key-result/service'
import { DomainKeyResultTimelineOrderEntry } from 'src/domain/key-result/timeline'

import { KeyResultCommentDTO } from './dto'
import { KeyResultComment } from './entities'
import DomainKeyResultCommentRepository from './repository'

export interface DomainKeyResultCommentServiceInterface {
  getForTimelineEntries: (
    entries: DomainKeyResultTimelineOrderEntry[],
  ) => Promise<KeyResultComment[]>
}

@Injectable()
class DomainKeyResultCommentService
  extends DomainEntityService<KeyResultComment, KeyResultCommentDTO>
  implements DomainKeyResultCommentServiceInterface {
  constructor(
    protected readonly repository: DomainKeyResultCommentRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(DomainKeyResultCommentService.name, repository)
  }

  public async getForTimelineEntries(entries: DomainKeyResultTimelineOrderEntry[]) {
    const commentIDs = entries.map((entry) => entry.id)
    const result = await this.repository.findByIds(commentIDs)

    return result
  }

  protected async protectCreationQuery(
    query: DomainCreationQuery<KeyResultComment>,
    data: Partial<KeyResultCommentDTO>,
    queryContext: DomainQueryContext,
  ) {
    const selector = { id: data.keyResultId }

    const validationData = await this.keyResultService.getOneWithConstraint(selector, queryContext)
    if (!validationData) return

    return query()
  }
}

export default DomainKeyResultCommentService
