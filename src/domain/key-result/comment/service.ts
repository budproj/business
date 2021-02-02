import { forwardRef, Inject, Injectable } from '@nestjs/common'

import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import DomainKeyResultService from 'src/domain/key-result/service'

import { KeyResultCommentDTO } from './dto'
import { KeyResultComment } from './entities'
import DomainKeyResultCommentRepository from './repository'

@Injectable()
class DomainKeyResultCommentService extends DomainEntityService<
  KeyResultComment,
  KeyResultCommentDTO
> {
  constructor(
    protected readonly repository: DomainKeyResultCommentRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(DomainKeyResultCommentService.name, repository)
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
